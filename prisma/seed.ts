import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Demo user (credentials login)
  const demoPassword = "Demo123!";
  const demoUser = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@trapstore.it",
      passwordHash: await bcrypt.hash(demoPassword, 10),
    },
  });

  console.log("Demo user created:", demoUser.email, "password:", demoPassword);

  // Products (mock)
  const products = [
    {
      slug: "tee-v2-portrait-washed-plum",
      name: "TEE V2 PORTRAIT — WASHED PLUM",
      description:
        "T-shirt heavy cotton con stampa ritratto in B/N. Mood underground, finitura washed, vestibilità regular.",
      category: "tshirts",
      tags: ["drop_01", "portrait", "washed"],
      images: ["/mock/c.jpeg"],
      variants: [
        { sku: "V2-TEE-PLUM-S", color: "Plum", size: "S", priceGrossCents: 3900, stockQty: 12 },
        { sku: "V2-TEE-PLUM-M", color: "Plum", size: "M", priceGrossCents: 3900, stockQty: 18 },
        { sku: "V2-TEE-PLUM-L", color: "Plum", size: "L", priceGrossCents: 3900, stockQty: 18 },
        { sku: "V2-TEE-PLUM-XL", color: "Plum", size: "XL", priceGrossCents: 3900, stockQty: 10 },
      ],
    },
    {
      slug: "tee-v2-portrait-dark-red",
      name: "TEE V2 PORTRAIT — DARK RED",
      description:
        "T-shirt statement. Grafica centrale, tonalità rosso scuro, lookbook notturno. Edizione limitata.",
      category: "tshirts",
      tags: ["drop_01", "red", "statement"],
      images: ["/mock/c.jpeg"],
      variants: [
        { sku: "V2-TEE-RED-S", color: "Dark Red", size: "S", priceGrossCents: 3900, stockQty: 8 },
        { sku: "V2-TEE-RED-M", color: "Dark Red", size: "M", priceGrossCents: 3900, stockQty: 12 },
        { sku: "V2-TEE-RED-L", color: "Dark Red", size: "L", priceGrossCents: 3900, stockQty: 12 },
        { sku: "V2-TEE-RED-XL", color: "Dark Red", size: "XL", priceGrossCents: 3900, stockQty: 6 },
      ],
    },
    {
      slug: "hoodie-v2-italy-central-washed-black",
      name: "HOODIE V2 — ITALY CENTRAL WASHED BLACK",
      description:
        "Felpa heavy con cappuccio, effetto washed nero/antracite. Stampa V2 grande sul retro. Fit: oversize.",
      category: "hoodies",
      tags: ["drop_02", "hoodie", "washed_black"],
      images: ["/mock/hoodies-grid.jpeg"],
      variants: [
        { sku: "V2-HOOD-BLK-S", color: "Washed Black", size: "S", priceGrossCents: 7900, stockQty: 6 },
        { sku: "V2-HOOD-BLK-M", color: "Washed Black", size: "M", priceGrossCents: 7900, stockQty: 10 },
        { sku: "V2-HOOD-BLK-L", color: "Washed Black", size: "L", priceGrossCents: 7900, stockQty: 10 },
        { sku: "V2-HOOD-BLK-XL", color: "Washed Black", size: "XL", priceGrossCents: 7900, stockQty: 5 },
      ],
    },
  ] as const;

  for (const p of products) {
    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        category: p.category,
        tags: p.tags,
        images: p.images,
        variants: {
          create: p.variants.map((v) => ({
            sku: v.sku,
            color: v.color,
            size: v.size,
            priceGrossCents: v.priceGrossCents,
            stockQty: v.stockQty,
            currency: "EUR",
          })),
        },
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
