"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";
import Price from "@/components/Price";
import { cn } from "@/lib/cn";

type VariantDTO = {
  id: string;
  color: string;
  size: string;
  priceGrossCents: number;
  stockQty: number;
};

type ProductDTO = {
  slug: string;
  name: string;
  category: string;
  description: string;
  images: string[];
};

export default function ProductPurchasePanel({
  product,
  variants,
}: {
  product: ProductDTO;
  variants: VariantDTO[];
}) {
  const { addItem } = useCart();

  const colors = useMemo(() => Array.from(new Set(variants.map((v) => v.color))), [variants]);
  const [color, setColor] = useState(colors[0] ?? "");
  const sizesForColor = useMemo(
    () => variants.filter((v) => v.color === color).map((v) => v.size),
    [variants, color]
  );
  const [size, setSize] = useState(sizesForColor[0] ?? "");

  const selected = useMemo(
    () => variants.find((v) => v.color === color && v.size === size) ?? null,
    [variants, color, size]
  );

  const inStock = (selected?.stockQty ?? 0) > 0;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-muted">V2 · ITALY CENTRAL</div>
          <h1 className="mt-2 font-[var(--font-display)] text-3xl text-white">{product.name}</h1>
          <p className="mt-2 text-sm text-muted">{product.description}</p>
        </div>
        {selected ? (
          <div className="text-right">
            <div className="text-xs text-muted">IVA inclusa</div>
            <Price cents={selected.priceGrossCents} className="text-xl font-semibold text-white" />
            <div className="mt-1 text-xs text-muted">{inStock ? "Disponibile" : "Sold out"}</div>
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-5">
        <div>
          <div className="label">Colore</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                className={cn("chip", c === color ? "border-accent/70 text-white" : "hover:border-border")}
                onClick={() => {
                  setColor(c);
                  const firstSize = variants.find((v) => v.color === c)?.size ?? "";
                  setSize(firstSize);
                }}
                type="button"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="label">Taglia</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizesForColor.map((s) => {
              const v = variants.find((x) => x.color === color && x.size === s);
              const disabled = !v || v.stockQty <= 0;
              return (
                <button
                  key={s}
                  className={cn(
                    "chip",
                    s === size ? "border-accent/70 text-white" : "hover:border-border",
                    disabled && "opacity-40 line-through"
                  )}
                  onClick={() => setSize(s)}
                  disabled={disabled}
                  type="button"
                >
                  {s}
                </button>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-muted">
            Fit: {product.category === "hoodies" ? "oversize (consigliato +0 / +1)" : "regular"} ·{" "}
            <span className="underline decoration-accent/60">Guida taglie</span>
          </div>
        </div>

        <div className="grid gap-2">
          <button
            className={cn("btn-primary w-full", !selected || !inStock ? "opacity-50" : "")}
            onClick={() => {
              if (!selected || !inStock) return;
              addItem(
                {
                  variantId: selected.id,
                  productSlug: product.slug,
                  name: product.name,
                  image: product.images[0] ?? "/mock/c.jpeg",
                  color: selected.color,
                  size: selected.size,
                  priceGrossCents: selected.priceGrossCents,
                },
                1
              );
            }}
            disabled={!selected || !inStock}
          >
            {inStock ? "Aggiungi al carrello" : "Esaurito"}
          </button>

          <div className="grid gap-1 text-xs text-muted">
            <div>• Reso/recesso entro 14 giorni</div>
            <div>• Pagamenti: carta e PayPal</div>
            <div>• Stock reale per variante</div>
          </div>
        </div>
      </div>
    </div>
  );
}
