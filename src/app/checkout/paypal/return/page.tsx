"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartProvider";

export default function PayPalReturnPage() {
  const sp = useSearchParams();
  const token = sp.get("token"); // PayPal order id
  const orderId = sp.get("orderId");
  const { clear } = useCart();

  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      if (!token) {
        setStatus("error");
        setMessage("Token PayPal mancante.");
        return;
      }

      try {
        const res = await fetch("/api/checkout/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paypalOrderId: token }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error ?? "Errore capture PayPal.");

        clear();
        setStatus("ok");
      } catch (e: any) {
        setStatus("error");
        setMessage(e.message ?? "Errore PayPal.");
      }
    }
    run();
  }, [token, clear]);

  if (status === "loading") {
    return (
      <div className="card p-6">
        <div className="text-xs uppercase tracking-[0.25em] text-muted">PayPal</div>
        <h1 className="mt-1 font-[var(--font-display)] text-3xl text-white">CONFERMA PAGAMENTO…</h1>
        <p className="mt-2 text-sm text-muted">Sto confermando il pagamento con PayPal.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="card p-6">
        <div className="text-xs uppercase tracking-[0.25em] text-muted">PayPal</div>
        <h1 className="mt-1 font-[var(--font-display)] text-3xl text-white">ERRORE</h1>
        <p className="mt-2 text-sm text-muted">{message ?? "Errore."}</p>
        <div className="mt-5 flex gap-3">
          <Link className="btn-primary" href="/checkout">
            Torna al checkout
          </Link>
          <Link className="btn-ghost" href="/support">
            Supporto
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="text-xs uppercase tracking-[0.25em] text-muted">PayPal</div>
      <h1 className="mt-1 font-[var(--font-display)] text-3xl text-white">PAGAMENTO OK</h1>
      <p className="mt-2 text-sm text-muted">Pagamento confermato. Riceverai un’email.</p>
      {orderId ? (
        <p className="mt-3 text-xs text-muted">
          Ordine: <span className="text-fg">{orderId}</span>
        </p>
      ) : null}
      <div className="mt-5 flex gap-3">
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
