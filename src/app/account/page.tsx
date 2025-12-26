import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Price from "@/components/Price";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/api/auth/signin");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/api/auth/signin");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted">Account</div>
        <h1 className="mt-1 font-[var(--font-display)] text-4xl text-white">AREA UTENTE</h1>
        <p className="mt-2 text-sm text-muted">Bentornato, {session.user.email}.</p>
      </div>

      <section className="card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-[var(--font-display)] text-2xl text-white">Ordini</div>
            <div className="mt-1 text-sm text-muted">Storico ordini (demo). In produzione aggiungere filtri/stati.</div>
          </div>
          <Link className="btn-ghost" href="/api/auth/signout">
            Logout
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Nessun ordine.</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {orders.map((o) => (
              <Link
                key={o.id}
                href={`/account/orders/${o.id}`}
                className="flex items-center justify-between rounded-xl border border-border/60 p-4 hover:border-accent/60"
              >
                <div>
                  <div className="text-sm font-medium text-fg">{o.id}</div>
                  <div className="mt-1 text-xs text-muted">
                    {o.status} · {new Date(o.createdAt).toLocaleString("it-IT")}
                  </div>
                </div>
                <div className="text-right">
                  <Price cents={o.totalCents} />
                  <div className="mt-1 text-xs text-muted">{o.paymentStatus}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="card p-6">
        <div className="font-[var(--font-display)] text-2xl text-white">Note</div>
        <p className="mt-2 text-sm text-muted">
          In questa base, gli ordini vengono associati all’utente solo se implementi il collegamento userId al momento del checkout.
          Attualmente gli ordini creati dal checkout “guest” restano senza userId. Vedi README per l’upgrade.
        </p>
      </section>
    </div>
  );
}
