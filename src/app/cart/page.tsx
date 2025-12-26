"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import Price from "@/components/Price";

export default function CartPage() {
  const { items, removeItem, setQuantity, subtotalGrossCents } = useCart();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted">Carrello</div>
        <h1 className="mt-1 font-[var(--font-display)] text-4xl text-white">CART</h1>

        {items.length === 0 ? (
          <div className="mt-6 card p-6">
            <p className="text-sm text-muted">Il carrello è vuoto.</p>
            <Link className="btn-primary mt-4" href="/shop">
              Torna allo shop
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {items.map((it) => (
              <div key={it.variantId} className="card flex gap-4 p-4">
                <div className="relative h-20 w-28 overflow-hidden rounded-xl border border-border/50 bg-black/40">
                  <Image src={it.image} alt={it.name} fill className="object-cover opacity-90" />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-fg">{it.name}</div>
                      <div className="mt-1 text-xs text-muted">
                        {it.color} / {it.size}
                      </div>
                    </div>
                    <button
                      className="btn-ghost h-10 w-10 p-0"
                      onClick={() => removeItem(it.variantId)}
                      aria-label="Rimuovi"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <label className="label">Q.tà</label>
                      <input
                        className="input w-20"
                        type="number"
                        min={1}
                        max={99}
                        value={it.quantity}
                        onChange={(e) => setQuantity(it.variantId, Number(e.target.value))}
                      />
                    </div>
                    <Price cents={it.priceGrossCents * it.quantity} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="h-fit card p-5">
        <div className="text-xs uppercase tracking-[0.25em] text-muted">Riepilogo</div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted">Subtotale (IVA incl.)</span>
          <Price cents={subtotalGrossCents} />
        </div>
        <p className="mt-2 text-xs text-muted">Spedizione e metodi disponibili verranno calcolati al checkout.</p>

        <Link
          className={`btn-primary mt-5 w-full ${items.length === 0 ? "pointer-events-none opacity-50" : ""}`}
          href="/checkout"
        >
          Vai al checkout
        </Link>

        <div className="mt-4 text-xs text-muted">
          Pagamenti: carta (Stripe) e PayPal. Il tuo ordine sarà confermato via email.
        </div>
      </aside>
    </div>
  );
}
