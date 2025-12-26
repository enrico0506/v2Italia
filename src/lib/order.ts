import { calcVatFromGross } from "@/lib/tax";
import { CartItem } from "@/lib/cart";

export function calcSubtotalGrossCents(items: CartItem[]) {
  return items.reduce((acc, it) => acc + it.priceGrossCents * it.quantity, 0);
}

export function calcOrderTotals(params: {
  items: CartItem[];
  shippingCostCents: number;
  vatRateBps: number;
}) {
  const subtotalGrossCents = calcSubtotalGrossCents(params.items);
  const vatCents = calcVatFromGross(subtotalGrossCents, params.vatRateBps);
  const totalCents = subtotalGrossCents + params.shippingCostCents;
  return { subtotalGrossCents, vatCents, totalCents };
}
