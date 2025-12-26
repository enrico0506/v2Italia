import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendEmail, renderOrderEmail } from "@/lib/email";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!process.env.STRIPE_SECRET_KEY || !secret) {
    return NextResponse.json({ ok: false, error: "Stripe webhook non configurato." }, { status: 500 });
  }

  const sig = headers().get("stripe-signature");
  if (!sig) return NextResponse.json({ ok: false, error: "Missing signature" }, { status: 400 });

  const rawBody = await req.text();

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const orderId = session?.metadata?.orderId as string | undefined;

    if (orderId) {
      // Mark paid + decrement stock in a transaction
      const order = await prisma.$transaction(async (tx) => {
        const existing = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });

        if (!existing) return null;
        if (existing.paymentStatus === "PAID") return existing;

        // Decrement stock for each item
        for (const item of existing.items) {
          await tx.variant.update({
            where: { id: item.variantId },
            data: { stockQty: { decrement: item.quantity } },
          });
        }

        return await tx.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "PAID",
            status: "PAID",
          },
          include: { items: { include: { variant: { include: { product: true } } } } },
        });
      });

      if (order) {
        // Send confirmation email
        await sendEmail({
          to: order.email,
          subject: `Pagamento confermato · ${order.id}`,
          html: renderOrderEmail({
            title: "Pagamento confermato",
            orderId: order.id,
            items: order.items.map((it) => ({
              name: `${it.variant.product.name} · ${it.variant.color} / ${it.variant.size}`,
              qty: it.quantity,
              lineTotalCents: it.lineTotalGrossCents,
            })),
            subtotalCents: order.subtotalGrossCents,
            shippingCents: order.shippingCostCents,
            totalCents: order.totalCents,
          }),
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
