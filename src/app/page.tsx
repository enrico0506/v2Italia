import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { variants: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="space-y-14">
      <section className="card overflow-hidden">
        <div className="relative grid gap-8 p-6 md:grid-cols-2 md:p-10">
          <div className="relative z-10">
            <div className="chip border-accent/60 text-fg">DROP ATTIVO</div>
            <h1 className="mt-4 font-[var(--font-display)] text-4xl leading-none text-white md:text-6xl">
              TRAP SCURO.
              <br />
              MINIMAL.
              <br />
              IMPATTO.
            </h1>
            <p className="mt-4 max-w-md text-sm text-muted">
              Felpe e t‑shirt in drop limitati. Texture washed, ritratti in B/N, monogramma V2.
              Prezzi IVA inclusa. Pagamenti sicuri.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="btn-primary" href="/shop">
                Entra nello shop
              </Link>
              <Link className="btn-ghost" href="/about">
                Il brand
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted">
              <span className="chip">14 giorni recesso</span>
              <span className="chip">Spedizioni IT/UE</span>
              <span className="chip">Carta + PayPal</span>
            </div>
          </div>

          <div className="relative min-h-[240px] overflow-hidden rounded-2xl border border-border/50 bg-black/40 md:min-h-[380px]">
            <Image
              src="/mock/c.jpeg"
              alt="Lookbook"
              fill
              className="object-cover opacity-90"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-muted">ITALY CENTRAL</div>
                <div className="font-[var(--font-display)] text-2xl text-white">V2</div>
              </div>
              <div className="text-right text-xs text-muted">NO RESTOCK*</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted">Nuovi arrivi</div>
            <h2 className="mt-1 font-[var(--font-display)] text-3xl text-white">DROP / NEW</h2>
          </div>
          <Link className="btn-ghost" href="/shop">
            Vedi tutto
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </section>

      <section className="card p-6 md:p-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted">Mood</div>
            <div className="mt-1 font-[var(--font-display)] text-2xl text-white">UNDERGROUND</div>
            <p className="mt-2 text-sm text-muted">
              Layout minimale, focus su prodotto e materiali. Accento rosso scuro. Nessun rumore.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted">Materiali</div>
            <div className="mt-1 font-[var(--font-display)] text-2xl text-white">HEAVY</div>
            <p className="mt-2 text-sm text-muted">
              Fit dichiarato, guida taglie, cura del capo. Trasparenza su IVA e spedizioni.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted">Processo</div>
            <div className="mt-1 font-[var(--font-display)] text-2xl text-white">DROP</div>
            <p className="mt-2 text-sm text-muted">
              Stock reale, ordini tracciati, email automatiche (ordine/pagamento/spedizione).
            </p>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted">
          *“No restock” è una claim da usare solo se reale e verificabile (evita rischi reputazionali).
        </p>
      </section>
    </div>
  );
}
