export function formatEURFromCents(cents: number) {
  const value = (cents ?? 0) / 100;
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(value);
}
