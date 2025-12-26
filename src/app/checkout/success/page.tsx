"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/components/CartProvider";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clear } = useCart();

  useEffect(() => {
    // Client-side cleanup: cart is cleared after a successful payment redirect.
    clear();
  }, [clear]);

  return (
    <div className="card p-6">
      <div className="text-xs uppercase tracking-[0.25em] text-muted">Success</div>
      <h1 className="mt-1 font-[var(--font-display)] text-3xl text-white">PAGAMENTO OK</h1>
      <p className="mt-2 text-sm text-muted">
        Grazie. Abbiamo ricevuto il pagamento. Riceverai un’email di conferma.
      </p>
      {orderId ? (
        <p className="mt-3 text-xs text-muted">
          Ordine: <span className="text-fg">{orderId}</span>
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link className="btn-primary" href="/shop">
          Torna allo shop
        </Link>
        <Link className="btn-ghost" href="/account">
          Area utente
        </Link>
      </div>
    </div>
  );
}
