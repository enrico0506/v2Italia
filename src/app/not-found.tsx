import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card p-6">
      <div className="text-xs uppercase tracking-[0.25em] text-muted">404</div>
      <h1 className="mt-1 font-[var(--font-display)] text-3xl text-white">NON TROVATO</h1>
      <p className="mt-2 text-sm text-muted">La pagina che cerchi non esiste.</p>
      <div className="mt-5 flex gap-3">
        <Link className="btn-primary" href="/shop">
          Vai allo shop
        </Link>
        <Link className="btn-ghost" href="/">
          Home
        </Link>
      </div>
    </div>
  );
}
