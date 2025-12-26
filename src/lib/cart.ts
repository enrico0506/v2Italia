export type CartItem = {
  variantId: string;
  productSlug: string;
  name: string;
  image: string;
  color: string;
  size: string;
  priceGrossCents: number;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

export const CART_STORAGE_KEY = "v2_cart_v1";

export function safeParseCart(value: string | null): CartState {
  if (!value) return { items: [] };
  try {
    const parsed = JSON.parse(value) as CartState;
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
    // basic validation
    return {
      items: parsed.items
        .filter((it) => it && typeof it.variantId === "string" && typeof it.quantity === "number")
        .map((it) => ({ ...it, quantity: Math.max(1, Math.min(99, it.quantity)) })),
    };
  } catch {
    return { items: [] };
  }
}
