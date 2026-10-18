import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OSIDAC — Virtual Franchise & Rewards",
    short_name: "OSIDAC",
    description:
      "A virtual storefront with daily missions and community features. KOIN points are in-app points with no cash value; cash top-ups and withdrawals are not available.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#059669",
    icons: [
      { src: "/images/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/images/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
