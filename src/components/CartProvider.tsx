"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CART_STORAGE_KEY, CartItem, CartState, safeParseCart } from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
  subtotalGrossCents: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const initial = safeParseCart(window.localStorage.getItem(CART_STORAGE_KEY));
    setState(initial);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = state.items.reduce((acc, it) => acc + it.priceGrossCents * it.quantity, 0);
    const count = state.items.reduce((acc, it) => acc + it.quantity, 0);

    return {
      items: state.items,
      addItem: (item, quantity = 1) => {
        setState((prev) => {
          const q = Math.max(1, Math.min(99, quantity));
          const idx = prev.items.findIndex((x) => x.variantId === item.variantId);
          if (idx >= 0) {
            const next = [...prev.items];
            next[idx] = { ...next[idx], quantity: Math.min(99, next[idx].quantity + q) };
            return { items: next };
          }
          return { items: [...prev.items, { ...item, quantity: q }] };
        });
      },
      removeItem: (variantId) => {
        setState((prev) => ({ items: prev.items.filter((x) => x.variantId !== variantId) }));
      },
      setQuantity: (variantId, quantity) => {
        setState((prev) => {
          const q = Math.max(1, Math.min(99, quantity));
          return { items: prev.items.map((x) => (x.variantId === variantId ? { ...x, quantity: q } : x)) };
        });
      },
      clear: () => setState({ items: [] }),
      subtotalGrossCents: subtotal,
      itemCount: count,
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
