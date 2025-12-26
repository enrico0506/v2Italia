export type ShippingOption = {
  id: string;
  label: string;
  etaLabel: string;
  costCents: number;
  countries: string[]; // ISO-2
};

const IT: ShippingOption[] = [
  { id: "it_standard", label: "Standard Italia", etaLabel: "2–4 giorni", costCents: 690, countries: ["IT"] },
  { id: "it_express", label: "Express Italia", etaLabel: "1–2 giorni", costCents: 990, countries: ["IT"] },
];

const EU: ShippingOption[] = [
  { id: "eu_standard", label: "Standard UE", etaLabel: "3–7 giorni", costCents: 1290, countries: ["AT","BE","BG","CY","CZ","DE","DK","EE","ES","FI","FR","GR","HR","HU","IE","LT","LU","LV","MT","NL","PL","PT","RO","SE","SI","SK"] },
];

const EXTRA: ShippingOption[] = [
  { id: "world_standard", label: "International", etaLabel: "7–14 giorni", costCents: 2490, countries: ["*"] },
];

export function getShippingOptions(countryCode: string): ShippingOption[] {
  const cc = (countryCode || "").toUpperCase();
  if (IT.some((o) => o.countries.includes(cc))) return IT;
  if (EU.some((o) => o.countries.includes(cc))) return EU;
  return EXTRA;
}

export function findShippingOption(id: string, countryCode: string): ShippingOption | null {
  const opts = getShippingOptions(countryCode);
  return opts.find((o) => o.id === id) ?? null;
}
