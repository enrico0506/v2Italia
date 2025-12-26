import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: { category?: string; inStock?: string };
}) {
  const category = searchParams?.category;
  const inStock = searchParams?.inStock === "1";

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category } : {}),
    },
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  const filtered = inStock
    ? products.filter((p) => p.variants.some((v) => v.stockQty > 0))
    : products;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-muted">Catalogo</div>
          <h1 className="mt-1 font-[var(--font-display)] text-4xl text-white">SHOP</h1>
          <p className="mt-2 text-sm text-muted">Felpe e t‑shirt. Varianti taglia/colore. Stock reale.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link className="chip hover:border-accent/60" href="/shop">
            Tutto
          </Link>
          <Link className="chip hover:border-accent/60" href="/shop?category=hoodies">
            Felpe
          </Link>
          <Link className="chip hover:border-accent/60" href="/shop?category=tshirts">
            T‑shirt
          </Link>
          <Link className="chip hover:border-accent/60" href={`/shop${category ? `?category=${category}&` : "?"}inStock=1`}>
            Solo disponibili
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p as any} />
        ))}
      </div>
    </div>
  );
}
