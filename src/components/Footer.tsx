import Link from "next/link";

function env(name: string, fallback: string) {
  return process.env[name] ?? fallback;
}

export default function Footer() {
  const businessName = env("BUSINESS_NAME", "Ragione Sociale S.r.l.");
  const businessVat = env("BUSINESS_VAT", "IT00000000000");
  const businessAddress = env("BUSINESS_ADDRESS", "Via Esempio 1, 20100 Milano (MI), Italia");
  const businessRea = env("BUSINESS_REA", "MI-0000000");
  const businessEmail = env("BUSINESS_EMAIL", "support@yourdomain.it");
  const businessPec = env("BUSINESS_PEC", "pec@yourdomain.it");

  return (
    <footer className="mt-16 border-t border-border/40 bg-black/30">
      <div className="container-page grid gap-8 py-10 md:grid-cols-3">
        <div>
          <div className="font-[var(--font-display)] text-2xl">V2</div>
          <p className="mt-2 text-sm text-muted">
            Underground trap streetwear. Drop limitati. Minimal, scuro, diretto.
          </p>
        </div>

        <div className="text-sm">
          <div className="mb-3 text-xs uppercase tracking-wider text-muted">Link</div>
          <ul className="space-y-2">
            <li>
              <Link className="hover:text-white" href="/shop">
                Shop
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/support">
                Supporto
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/about">
                Brand
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <div className="mb-3 text-xs uppercase tracking-wider text-muted">Dati aziendali</div>
          <div className="space-y-1 text-muted">
            <div className="text-fg">{businessName}</div>
            <div>{businessAddress}</div>
            <div>P.IVA {businessVat}</div>
            <div>REA {businessRea}</div>
            <div>Email: {businessEmail}</div>
            <div>PEC: {businessPec}</div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} {businessName}. Tutti i diritti riservati.</div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link className="hover:text-white" href="/legal/terms">Termini</Link>
            <Link className="hover:text-white" href="/legal/privacy">Privacy</Link>
            <Link className="hover:text-white" href="/legal/cookies">Cookie</Link>
            <Link className="hover:text-white" href="/legal/returns">Resi & Recesso</Link>
            <Link className="hover:text-white" href="/legal/shipping">Spedizioni</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
