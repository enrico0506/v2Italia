"use client";

import Link from "next/link";
import { ShoppingBag, UserRound, Search } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/cn";

export default function Header() {
  const { itemCount } = useCart();
  const { status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-bg/70 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-[var(--font-display)] text-2xl tracking-tight text-fg">V2</span>
          <span className="hidden text-xs uppercase tracking-[0.25em] text-muted sm:block">ITALY CENTRAL</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm sm:flex">
          <Link className="hover:text-white" href="/shop">
            Shop
          </Link>
          <Link className="hover:text-white" href="/shop/hoodies">
            Felpe
          </Link>
          <Link className="hover:text-white" href="/shop/tshirts">
            T‑shirt
          </Link>
          <Link className="hover:text-white" href="/support">
            Supporto
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            aria-label="Cerca"
            className={cn("btn-ghost h-10 w-10 p-0", "rounded-xl")}
          >
            <Search size={18} />
          </Link>

          <Link
            href={status === "authenticated" ? "/account" : "/api/auth/signin"}
            aria-label="Account"
            className={cn("btn-ghost h-10 w-10 p-0", "rounded-xl")}
          >
            <UserRound size={18} />
          </Link>

          <Link href="/cart" aria-label="Carrello" className={cn("btn-ghost relative h-10 w-10 p-0", "rounded-xl")}>
            <ShoppingBag size={18} />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-semibold text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
