export type ProductTier = {
  tier: "starter" | "kios" | "gold" | "elite" | "master";
  name: string;
  priceIdr: number;
  priceUsd: number;
  storeLevel: number;
  osidMultiplier: number;
  accent: "lime" | "coral" | "sky" | "violet" | "gold";
};

// Display catalog mirrors the seeded package rows in migration 0002.
// Checkout must always read the current server-side package row, never trust these UI values.
export const productTiers: ProductTier[] = [
  { tier: "starter", name: "Starter Booth", priceIdr: 49_000, priceUsd: 3.49, storeLevel: 2, osidMultiplier: 1.2, accent: "lime" },
  { tier: "kios", name: "Kios Pro", priceIdr: 149_000, priceUsd: 9.99, storeLevel: 4, osidMultiplier: 1.4, accent: "coral" },
  { tier: "gold", name: "Warung Gold", priceIdr: 499_000, priceUsd: 34.99, storeLevel: 6, osidMultiplier: 1.6, accent: "sky" },
  { tier: "elite", name: "Franchise Elite", priceIdr: 1_490_000, priceUsd: 99.99, storeLevel: 8, osidMultiplier: 1.8, accent: "violet" },
  { tier: "master", name: "Empire Master", priceIdr: 4_900_000, priceUsd: 349.99, storeLevel: 10, osidMultiplier: 2, accent: "gold" },
];

export function formatTierPrice(tier: ProductTier, locale: string) {
  const isIndonesian = locale === "id";
  return new Intl.NumberFormat(isIndonesian ? "id-ID" : "en-US", {
    style: "currency",
    currency: isIndonesian ? "IDR" : "USD",
    maximumFractionDigits: isIndonesian ? 0 : 2,
  }).format(isIndonesian ? tier.priceIdr : tier.priceUsd);
}
