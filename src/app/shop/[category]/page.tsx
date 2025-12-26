import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

const allowed = new Set(["hoodies", "tshirts"]);

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category;
  if (!allowed.has(category)) return notFound();

  const products = await prisma.product.findMany({
    where: { isActive: true, category },
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  const title = category === "hoodies" ? "Felpe" : "T‑shirt";

  return (
    <div>
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted">Categoria</div>
        <h1 className="mt-1 font-[var(--font-display)] text-4xl text-white">{title}</h1>
        <p className="mt-2 text-sm text-muted">Stile trap scuro. Minimal ma d’impatto.</p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p as any} />
        ))}
      </div>
    </div>
  );
}
