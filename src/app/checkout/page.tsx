"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";
import Price from "@/components/Price";
import { getShippingOptions } from "@/lib/shipping";
import { defaultVatRateBpsForCountry, calcVatFromGross } from "@/lib/tax";
import { cn } from "@/lib/cn";

type PaymentMethod = "stripe" | "paypal";

export default function CheckoutPage() {
  const { items, subtotalGrossCents, clear } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customer, setCustomer] = useState({
    email: "",
    phone: "",
    shippingName: "",
    line1: "",
    line2: "",
    city: "",
    postcode: "",
    province: "",
    country: "IT",
  });

  const shippingOptions = useMemo(() => getShippingOptions(customer.country), [customer.country]);
  const [shippingMethodId, setShippingMethodId] = useState<string>("");

  useEffect(() => {
    if (!shippingMethodId && shippingOptions.length > 0) setShippingMethodId(shippingOptions[0]!.id);
  }, [shippingOptions, shippingMethodId]);

  const chosenShipping = shippingOptions.find((s) => s.id === shippingMethodId) ?? shippingOptions[0];
  const shippingCostCents = chosenShipping?.costCents ?? 0;

  const vatRateBps = defaultVatRateBpsForCountry(customer.country);
  const vatCents = calcVatFromGross(subtotalGrossCents, vatRateBps);
  const totalCents = subtotalGrossCents + shippingCostCents;

  async function payWithStripe() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            email: customer.email,
            phone: customer.phone || undefined,
            shippingName: customer.shippingName,
            line1: customer.line1,
            line2: customer.line2 || undefined,
            city: customer.city,
            postcode: customer.postcode,
            province: customer.province || undefined,
            country: customer.country,
          },
          shippingMethodId,
          items: items.map((it) => ({ variantId: it.variantId, quantity: it.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Errore checkout.");

      if (!data.url) throw new Error("Stripe session URL mancante.");
      window.location.href = data.url as string;
    } catch (e: any) {
      setError(e.message ?? "Errore checkout.");
      setLoading(false);
    }
  }

  async function payWithPayPalRedirect() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            email: customer.email,
            phone: customer.phone || undefined,
            shippingName: customer.shippingName,
            line1: customer.line1,
            line2: customer.line2 || undefined,
            city: customer.city,
            postcode: customer.postcode,
            province: customer.province || undefined,
            country: customer.country,
          },
          shippingMethodId,
          items: items.map((it) => ({ variantId: it.variantId, quantity: it.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Errore PayPal.");

      if (!data.approveUrl) throw new Error("PayPal approveUrl mancante.");
      window.location.href = data.approveUrl as string;
    } catch (e: any) {
      setError(e.message ?? "Errore PayPal.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="card p-6">
        <div className="text-xs uppercase tracking-[0.25em] text-muted">Checkout</div>
        <h1 className="mt-1 font-[var(--font-display)] text-3xl text-white">Nessun articolo</h1>
        <p className="mt-2 text-sm text-muted">Il carrello è vuoto. Aggiungi almeno un prodotto.</p>
        <Link className="btn-primary mt-4" href="/shop">
          Vai allo shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
      <div className="space-y-6">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-muted">Checkout</div>
          <h1 className="mt-1 font-[var(--font-display)] text-4xl text-white">CHECKOUT</h1>
          <p className="mt-2 text-sm text-muted">
            Inserisci i dati di spedizione e scegli il metodo di pagamento (carta o PayPal).
          </p>
        </div>

        <div className="card p-5">
          <div className="font-[var(--font-display)] text-xl text-white">Dati cliente</div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <div className="label">Email</div>
              <input className="input mt-2" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} placeholder="you@example.com" />
            </div>
            <div>
              <div className="label">Telefono (opz.)</div>
              <input className="input mt-2" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="+39 ..." />
            </div>
            <div className="md:col-span-2">
              <div className="label">Nome e cognome</div>
              <input className="input mt-2" value={customer.shippingName} onChange={(e) => setCustomer({ ...customer, shippingName: e.target.value })} placeholder="Nome Cognome" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="font-[var(--font-display)] text-xl text-white">Indirizzo spedizione</div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <div className="label">Indirizzo</div>
              <input className="input mt-2" value={customer.line1} onChange={(e) => setCustomer({ ...customer, line1: e.target.value })} placeholder="Via, numero civico" />
            </div>
            <div className="md:col-span-2">
              <div className="label">Interno / scala (opz.)</div>
              <input className="input mt-2" value={customer.line2} onChange={(e) => setCustomer({ ...customer, line2: e.target.value })} placeholder="Interno, scala, citofono..." />
            </div>

            <div>
              <div className="label">Città</div>
              <input className="input mt-2" value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} />
            </div>
            <div>
              <div className="label">CAP</div>
              <input className="input mt-2" value={customer.postcode} onChange={(e) => setCustomer({ ...customer, postcode: e.target.value })} />
            </div>
            <div>
              <div className="label">Provincia (opz.)</div>
              <input className="input mt-2" value={customer.province} onChange={(e) => setCustomer({ ...customer, province: e.target.value })} placeholder="MI" />
            </div>
            <div>
              <div className="label">Paese</div>
              <select
                className="input mt-2"
                value={customer.country}
                onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
              >
                <option value="IT">Italia</option>
                <option value="FR">Francia</option>
                <option value="DE">Germania</option>
                <option value="ES">Spagna</option>
                <option value="NL">Paesi Bassi</option>
                <option value="BE">Belgio</option>
                <option value="AT">Austria</option>
                <option value="PT">Portogallo</option>
                <option value="IE">Irlanda</option>
                <option value="CH">Svizzera</option>
                <option value="GB">Regno Unito</option>
                <option value="US">Stati Uniti</option>
              </select>
              <div className="mt-1 text-xs text-muted">
                (Base demo: mappa IVA semplificata. Per UE reale, configura aliquote/OSS.)
              </div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="font-[var(--font-display)] text-xl text-white">Spedizione</div>

          <div className="mt-4 grid gap-2">
            {shippingOptions.map((opt) => (
              <label key={opt.id} className={cn("flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border/60 p-4", opt.id === shippingMethodId ? "border-accent/60" : "hover:border-border")}>
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={opt.id === shippingMethodId}
                    onChange={() => setShippingMethodId(opt.id)}
                    className="mt-1 accent-[rgb(var(--accent))]"
                  />
                  <div>
                    <div className="text-sm font-medium text-fg">{opt.label}</div>
                    <div className="text-xs text-muted">{opt.etaLabel}</div>
                  </div>
                </div>
                <Price cents={opt.costCents} />
              </label>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="font-[var(--font-display)] text-xl text-white">Pagamento</div>

          <div className="mt-4 grid gap-2">
            <button
              type="button"
              className={cn("btn-ghost w-full justify-between", paymentMethod === "stripe" && "border-accent/60")}
              onClick={() => setPaymentMethod("stripe")}
            >
              <span>Carta di credito/debito (Stripe)</span>
              <span className="text-xs text-muted">SCA/3DS dove richiesto</span>
            </button>

            <button
              type="button"
              className={cn("btn-ghost w-full justify-between", paymentMethod === "paypal" && "border-accent/60")}
              onClick={() => setPaymentMethod("paypal")}
            >
              <span>PayPal</span>
              <span className="text-xs text-muted">Redirect sicuro</span>
            </button>
          </div>

          {error ? <div className="mt-4 rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm text-fg">{error}</div> : null}

          <div className="mt-4 grid gap-2">
            {paymentMethod === "stripe" ? (
              <button className="btn-primary w-full" onClick={payWithStripe} disabled={loading}>
                {loading ? "Reindirizzo..." : "Paga con carta"}
              </button>
            ) : (
              <button className="btn-primary w-full" onClick={payWithPayPalRedirect} disabled={loading}>
                {loading ? "Reindirizzo..." : "Paga con PayPal"}
              </button>
            )}

            <button
              type="button"
              className="btn-ghost w-full"
              onClick={() => {
                clear();
                window.location.href = "/shop";
              }}
              disabled={loading}
            >
              Svuota carrello (demo)
            </button>
          </div>

          <p className="mt-4 text-xs text-muted">
            Proseguendo accetti i <Link className="underline decoration-accent/60 hover:decoration-accent" href="/legal/terms">Termini</Link> e confermi di aver letto{" "}
            <Link className="underline decoration-accent/60 hover:decoration-accent" href="/legal/privacy">Privacy</Link> e{" "}
            <Link className="underline decoration-accent/60 hover:decoration-accent" href="/legal/cookies">Cookie</Link>.
          </p>
        </div>
      </div>

      <aside className="h-fit card p-5">
        <div className="text-xs uppercase tracking-[0.25em] text-muted">Riepilogo</div>

        <div className="mt-4 space-y-3">
          {items.map((it) => (
            <div key={it.variantId} className="flex items-start justify-between gap-3 text-sm">
              <div className="text-muted">
                {it.name} <span className="text-xs">({it.color}/{it.size})</span> × {it.quantity}
              </div>
              <Price cents={it.priceGrossCents * it.quantity} />
            </div>
          ))}
          <div className="border-t border-border/50 pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Subtotale (IVA incl.)</span>
              <Price cents={subtotalGrossCents} />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted">IVA (stima {vatRateBps / 100}% su prodotti)</span>
              <Price cents={vatCents} />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted">Spedizione</span>
              <Price cents={shippingCostCents} />
            </div>
            <div className="mt-3 flex items-center justify-between text-base font-semibold">
              <span className="text-white">Totale</span>
              <Price cents={totalCents} className="text-white" />
            </div>
          </div>

          <div className="text-xs text-muted">
            Nota: questa base include IVA/spedizioni configurabili. Per vendite UE reali, configura aliquote paese e valuta OSS.
          </div>
        </div>
      </aside>
    </div>
  );
}
