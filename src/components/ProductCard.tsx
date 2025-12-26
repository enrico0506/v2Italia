import Link from "next/link";
import Image from "next/image";
import { Product, Variant } from "@prisma/client";
import Price from "@/components/Price";

export type ProductWithVariants = Product & { variants: Variant[] };

export default function ProductCard({ product }: { product: ProductWithVariants }) {
  const images = (product.images as unknown as string[]) ?? [];
  const image = images[0] ?? "/mock/c.jpeg";
  const prices = product.variants.map((v) => v.priceGrossCents);
  const min = Math.min(...prices);

  return (
    <Link href={`/product/${encodeURIComponent(product.slug)}`} className="group block">
      <div className="card overflow-hidden">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover opacity-90 transition duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
          <div className="absolute left-3 top-3">
            <span className="chip border-accent/50 text-white">DROP</span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-[var(--font-display)] text-lg leading-tight text-fg">{product.name}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted">{product.category}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-xs text-muted">Da</div>
              <Price cents={min} />
            </div>
          </div>

          <div className="mt-4">
            <span className="btn-ghost w-full">Vedi prodotto</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
