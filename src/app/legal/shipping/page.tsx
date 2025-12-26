import { getShippingOptions } from "@/lib/shipping";
import Price from "@/components/Price";

export default function ShippingPage() {
  const it = getShippingOptions("IT");
  const eu = getShippingOptions("FR");
  const extra = getShippingOptions("US");

  return (
    <div className="prose prose-invert max-w-none">
      <div className="text-xs uppercase tracking-[0.25em] text-muted">Legale</div>
      <h1 className="font-[var(--font-display)]">Spedizioni (bozza)</h1>

      <p>
        Costi e tempi stimati. Aggiorna questa pagina in base ai tuoi corrieri, contratti e zone reali.
      </p>

      <h2>Italia</h2>
      <ul>
        {it.map((o) => (
          <li key={o.id}>
            {o.label} · {o.etaLabel} · <Price cents={o.costCents} />
          </li>
        ))}
      </ul>

      <h2>Unione Europea</h2>
      <ul>
        {eu.map((o) => (
          <li key={o.id}>
            {o.label} · {o.etaLabel} · <Price cents={o.costCents} />
          </li>
        ))}
      </ul>

      <h2>Extra UE</h2>
      <ul>
        {extra.map((o) => (
          <li key={o.id}>
            {o.label} · {o.etaLabel} · <Price cents={o.costCents} />
          </li>
        ))}
      </ul>
    </div>
  );
}
