import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";

export const dynamic = 'force-dynamic';

function slugify(input: string) {
  return input
    .trim()
    .replace(/[—–]/g, "-")
    .replace(/[^a-zA-Z0-9 -]+/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const raw = decodeURIComponent(params.slug).trim();
  const normalized = raw.toLowerCase();

  const product = await prisma.product.findFirst({
    where: { slug: { equals: normalized, mode: "insensitive" }, isActive: true },
    include: { variants: true },
  });

  if (product && raw !== product.slug) {
    redirect(`/product/${encodeURIComponent(product.slug)}`);
  }

  if (!product) {
    const slug = slugify(raw);
    if (slug && slug !== normalized) {
      const bySlug = await prisma.product.findFirst({
        where: { slug: { equals: slug, mode: "insensitive" }, isActive: true },
        include: { variants: true },
      });

      if (bySlug) {
        redirect(`/product/${encodeURIComponent(bySlug.slug)}`);
      }
    }

    return notFound();
  }

  const images = (product.images as unknown as string[]) ?? [];
  const variants = product.variants.map((v) => ({
    id: v.id,
    color: v.color,
    size: v.size,
    priceGrossCents: v.priceGrossCents,
    stockQty: v.stockQty,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="grid gap-4">
        <div className="card relative aspect-[4/3] overflow-hidden">
          <Image
            src={images[0] ?? "/mock/c.jpeg"}
            alt={product.name}
            fill
            className="object-cover opacity-95"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card relative aspect-[4/3] overflow-hidden">
            <Image src={images[1] ?? images[0] ?? "/mock/c.jpeg"} alt="" fill className="object-cover opacity-90" />
          </div>
          <div className="card relative aspect-[4/3] overflow-hidden">
            <Image src={images[2] ?? images[0] ?? "/mock/c.jpeg"} alt="" fill className="object-cover opacity-90" />
          </div>
        </div>

        <div className="card p-5">
          <div className="text-xs uppercase tracking-[0.25em] text-muted">Dettagli</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>• Composizione: 100% cotone (placeholder)</li>
            <li>• Cura: lavaggio 30°, al rovescio, no asciugatrice (placeholder)</li>
            <li>• Stampa: serigrafia / DTG (placeholder)</li>
            <li>• Produzione: Italia/UE (placeholder)</li>
          </ul>
        </div>
      </div>

      <ProductPurchasePanel
        product={{
          slug: product.slug,
          name: product.name,
          category: product.category,
          description: product.description,
          images,
        }}
        variants={variants}
      />
    </div>
  );
}
