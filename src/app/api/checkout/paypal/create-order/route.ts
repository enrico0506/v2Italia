import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { defaultVatRateBpsForCountry } from "@/lib/tax";
import { findShippingOption } from "@/lib/shipping";
import { createPayPalOrder } from "@/lib/paypal";
import { sendEmail, renderOrderEmail } from "@/lib/email";

const schema = z.object({
  customer: z.object({
    email: z.string().email(),
    phone: z.string().min(5).max(30).optional(),
    shippingName: z.string().min(1).max(120),
    line1: z.string().min(1).max(120),
    line2: z.string().max(120).optional().nullable(),
    city: z.string().min(1).max(80),
    postcode: z.string().min(2).max(20),
    province: z.string().max(80).optional().nullable(),
    country: z.string().min(2).max(2),
  }),
  shippingMethodId: z.string().min(1),
  items: z.array(z.object({ variantId: z.string().min(1), quantity: z.number().int().min(1).max(99) })).min(1),
});

export async function POST(req: Request) {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return NextResponse.json(
      { ok: false, error: "PayPal non configurato. Imposta PAYPAL_CLIENT_ID e PAYPAL_CLIENT_SECRET." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Dati checkout non validi." }, { status: 400 });
  }

  const { customer, shippingMethodId, items } = parsed.data;

  const shippingOption = findShippingOption(shippingMethodId, customer.country);
  if (!shippingOption) {
    return NextResponse.json({ ok: false, error: "Metodo di spedizione non valido." }, { status: 400 });
  }

  const variantIds = items.map((i) => i.variantId);
  const variants = await prisma.variant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  });

  if (variants.length !== variantIds.length) {
    return NextResponse.json({ ok: false, error: "Uno o più articoli non esistono più." }, { status: 400 });
  }

const normalized: Array<{
  variantId: string;
  sku: string;
  name: string;
  image?: string;
  unitPriceGrossCents: number;
  quantity: number;
  lineTotalGrossCents: number;
}> = [];

for (const it of items) {
  const v = variants.find((x) => x.id === it.variantId);
  if (!v) {
    return NextResponse.json({ ok: false, error: "Articolo non valido." }, { status: 400 });
  }
  if (v.stockQty < it.quantity) {
    return NextResponse.json(
      { ok: false, error: `Stock insufficiente per ${v.product.name} (${v.color}/${v.size}).` },
      { status: 409 }
    );
  }

  const productImages = (v.product.images as unknown as string[]) ?? [];
  normalized.push({
    variantId: v.id,
    sku: v.sku,
    name: `${v.product.name} · ${v.color} / ${v.size}`,
    image: productImages[0] ?? "/mock/c.jpeg",
    unitPriceGrossCents: v.priceGrossCents,
    quantity: it.quantity,
    lineTotalGrossCents: v.priceGrossCents * it.quantity,
  });
}

  const vatRateBps = defaultVatRateBpsForCountry(customer.country);
  const subtotalGrossCents = normalized.reduce((acc, it) => acc + it.lineTotalGrossCents, 0);
  const vatCents = Math.round((subtotalGrossCents * vatRateBps) / (10000 + vatRateBps));
  const totalCents = subtotalGrossCents + shippingOption.costCents;

const session = await getServerSession(authOptions);
const userEmail = session?.user?.email ?? null;
const user = userEmail ? await prisma.user.findUnique({ where: { email: userEmail } }) : null;

  const order = await prisma.order.create({
    data: {
      status: "PENDING",
      userId: user?.id ?? null,
      email: customer.email,
      phone: customer.phone ?? null,
      shippingName: customer.shippingName,
      shippingLine1: customer.line1,
      shippingLine2: customer.line2 ?? null,
      shippingCity: customer.city,
      shippingPostcode: customer.postcode,
      shippingProvince: customer.province ?? null,
      shippingCountry: customer.country,
      shippingMethod: shippingOption.id,
      shippingCostCents: shippingOption.costCents,
      vatRateBps,
      subtotalGrossCents,
      vatCents,
      totalCents,
      currency: "EUR",
      paymentProvider: "PAYPAL",
      paymentStatus: "UNPAID",
      items: {
        create: normalized.map((it) => ({
          variantId: it.variantId,
          quantity: it.quantity,
          unitPriceGrossCents: it.unitPriceGrossCents,
          lineTotalGrossCents: it.lineTotalGrossCents,
        })),
      },
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const returnUrl = `${baseUrl}/checkout/paypal/return?orderId=${order.id}`;
  const cancelUrl = `${baseUrl}/checkout/cancel?orderId=${order.id}`;

  const paypalOrder = await createPayPalOrder({
    totalCents,
    currency: "EUR",
    referenceId: order.id,
    returnUrl,
    cancelUrl,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentRef: paypalOrder.id },
  });

  await sendEmail({
    to: order.email,
    subject: `Ordine ricevuto · ${order.id}`,
    html: renderOrderEmail({
      title: "Ordine ricevuto",
      orderId: order.id,
      items: normalized.map((it) => ({ name: it.name, qty: it.quantity, lineTotalCents: it.lineTotalGrossCents })),
      subtotalCents: subtotalGrossCents,
      shippingCents: shippingOption.costCents,
      totalCents,
    }),
  });

  const approveUrl = Array.isArray(paypalOrder.links)
    ? (paypalOrder.links.find((l: any) => l.rel === "approve")?.href as string | undefined)
    : undefined;

  return NextResponse.json({ ok: true, paypalOrderId: paypalOrder.id, localOrderId: order.id, approveUrl });
}
