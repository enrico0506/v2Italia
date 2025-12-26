import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { capturePayPalOrder } from "@/lib/paypal";
import { sendEmail, renderOrderEmail } from "@/lib/email";

const schema = z.object({
  paypalOrderId: z.string().min(1),
});

export async function POST(req: Request) {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return NextResponse.json({ ok: false, error: "PayPal non configurato." }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Dati non validi." }, { status: 400 });
  }

  const paypalOrderId = parsed.data.paypalOrderId;

  const order = await prisma.order.findFirst({
    where: { paymentRef: paypalOrderId, paymentProvider: "PAYPAL" },
    include: { items: true },
  });

  if (!order) return NextResponse.json({ ok: false, error: "Ordine non trovato." }, { status: 404 });

  // Capture on PayPal
  const capture = await capturePayPalOrder(paypalOrderId);

  // Mark paid + decrement stock
  const updated = await prisma.$transaction(async (tx) => {
    const existing = await tx.order.findUnique({
      where: { id: order.id },
      include: { items: { include: { variant: { include: { product: true } } } } },
    });
    if (!existing) return null;
    if (existing.paymentStatus === "PAID") return existing;

    for (const item of existing.items) {
      await tx.variant.update({
        where: { id: item.variantId },
        data: { stockQty: { decrement: item.quantity } },
      });
    }

    return await tx.order.update({
      where: { id: order.id },
      data: { paymentStatus: "PAID", status: "PAID" },
      include: { items: { include: { variant: { include: { product: true } } } } },
    });
  });

  if (updated) {
    await sendEmail({
      to: updated.email,
      subject: `Pagamento confermato · ${updated.id}`,
      html: renderOrderEmail({
        title: "Pagamento confermato",
        orderId: updated.id,
        items: updated.items.map((it) => ({
          name: `${it.variant.product.name} · ${it.variant.color} / ${it.variant.size}`,
          qty: it.quantity,
          lineTotalCents: it.lineTotalGrossCents,
        })),
        subtotalCents: updated.subtotalGrossCents,
        shippingCents: updated.shippingCostCents,
        totalCents: updated.totalCents,
      }),
    });
  }

  return NextResponse.json({ ok: true, capture });
}
