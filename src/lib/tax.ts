/**
 * VAT utilities
 *
 * We store and show prices as GROSS (IVA inclusa) for EU B2C.
 * VAT portion is computed as:
 *   net = gross / (1 + rate)
 *   vat = gross - net
 */
export function calcNetFromGross(grossCents: number, vatRateBps: number) {
  const rate = vatRateBps / 10000;
  return Math.round(grossCents / (1 + rate));
}

export function calcVatFromGross(grossCents: number, vatRateBps: number) {
  const net = calcNetFromGross(grossCents, vatRateBps);
  return Math.max(0, grossCents - net);
}

export function defaultVatRateBpsForCountry(countryCode: string) {
  // Base implementation:
  // - IT: 22% standard VAT
  // Extend this mapping when you add EU OSS rules.
  const cc = (countryCode || "").toUpperCase();
  if (cc === "IT") return 2200;
  // Fallback: keep 22% until you configure properly.
  return 2200;
}
