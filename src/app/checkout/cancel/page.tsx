import Link from "next/link";

export default function CheckoutCancelPage({ searchParams }: { searchParams?: { orderId?: string } }) {
  const orderId = searchParams?.orderId;

  return (
    <div className="card p-6">
      <div className="text-xs uppercase tracking-[0.25em] text-muted">Checkout</div>
      <h1 className="mt-1 font-[var(--font-display)] text-3xl text-white">PAGAMENTO ANNULLATO</h1>
      <p className="mt-2 text-sm text-muted">
        Hai annullato il pagamento. Puoi riprovare quando vuoi.
      </p>
      {orderId ? (
        <p className="mt-3 text-xs text-muted">
          Ordine (pending): <span className="text-fg">{orderId}</span>
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link className="btn-primary" href="/checkout">
          Riprova checkout
        </Link>
        <Link className="btn-ghost" href="/cart">
          Torna al carrello
        </Link>
      </div>
    </div>
  );
}
