export type PlannedTier = {
  tier: "starter" | "kios" | "gold" | "elite" | "master";
  name: string;
  priceIdr: number;
  priceUsd: number;
  storeLevel: number;
  missionMultiplier: number;
  accent: "lime" | "coral" | "sky" | "violet" | "gold";
};

// Display-only product plan mirrors seeded package rows. It grants no entitlement;
// checkout, tier assignment, partner missions, and OSID issuance are not active.
export const plannedTiers: PlannedTier[] = [
  { tier: "starter", name: "Starter Booth", priceIdr: 49_000, priceUsd: 3.49, storeLevel: 2, missionMultiplier: 1.2, accent: "lime" },
  { tier: "kios", name: "Kios Pro", priceIdr: 149_000, priceUsd: 9.99, storeLevel: 4, missionMultiplier: 1.4, accent: "coral" },
  { tier: "gold", name: "Warung Gold", priceIdr: 499_000, priceUsd: 34.99, storeLevel: 6, missionMultiplier: 1.6, accent: "sky" },
  { tier: "elite", name: "Franchise Elite", priceIdr: 1_490_000, priceUsd: 99.99, storeLevel: 8, missionMultiplier: 1.8, accent: "violet" },
  { tier: "master", name: "Empire Master", priceIdr: 4_900_000, priceUsd: 349.99, storeLevel: 10, missionMultiplier: 2, accent: "gold" },
];

export function formatPlannedTierPrice(tier: PlannedTier, locale: string) {
  const isIndonesian = locale === "id";
  return new Intl.NumberFormat(isIndonesian ? "id-ID" : "en-US", {
    style: "currency",
    currency: isIndonesian ? "IDR" : "USD",
    maximumFractionDigits: isIndonesian ? 0 : 2,
  }).format(isIndonesian ? tier.priceIdr : tier.priceUsd);
}
