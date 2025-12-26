import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Price from "@/components/Price";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/api/auth/signin");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/api/auth/signin");

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { variant: { include: { product: true } } } } },
  });

  if (!order) return notFound();
  if (order.userId && order.userId !== user.id) return notFound();

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted">Ordine</div>
        <h1 className="mt-1 font-[var(--font-display)] text-4xl text-white">{order.id}</h1>
        <p className="mt-2 text-sm text-muted">
          Stato: {order.status} · Pagamento: {order.paymentStatus}
        </p>
      </div>

      <section className="card p-6">
        <div className="font-[var(--font-display)] text-2xl text-white">Articoli</div>
        <div className="mt-4 grid gap-3">
          {order.items.map((it) => (
            <div key={it.id} className="flex items-start justify-between gap-3 rounded-xl border border-border/60 p-4">
              <div>
                <div className="text-sm font-medium text-fg">{it.variant.product.name}</div>
                <div className="mt-1 text-xs text-muted">
                  {it.variant.color} / {it.variant.size} · Q.tà {it.quantity}
                </div>
              </div>
              <Price cents={it.lineTotalGrossCents} />
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-border/50 pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">Subtotale</span>
            <Price cents={order.subtotalGrossCents} />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-muted">Spedizione</span>
            <Price cents={order.shippingCostCents} />
          </div>
          <div className="mt-3 flex items-center justify-between text-base font-semibold">
            <span className="text-white">Totale</span>
            <Price cents={order.totalCents} className="text-white" />
          </div>
        </div>
      </section>

      <section className="card p-6">
        <div className="font-[var(--font-display)] text-2xl text-white">Spedizione</div>
        <div className="mt-3 text-sm text-muted">
          <div>{order.shippingName}</div>
          <div>{order.shippingLine1}</div>
          {order.shippingLine2 ? <div>{order.shippingLine2}</div> : null}
          <div>
            {order.shippingPostcode} {order.shippingCity} {order.shippingProvince ?? ""}
          </div>
          <div>{order.shippingCountry}</div>
          <div className="mt-2 text-xs">Metodo: {order.shippingMethod}</div>
        </div>
      </section>
    </div>
  );
}
