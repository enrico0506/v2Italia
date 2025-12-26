import { formatEURFromCents } from "@/lib/money";

export default function Price({ cents, className }: { cents: number; className?: string }) {
  return <span className={className ?? "font-semibold text-fg"}>{formatEURFromCents(cents)}</span>;
}
