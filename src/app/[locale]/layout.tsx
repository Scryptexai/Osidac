import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import SiteChrome from "@/components/site-chrome";
import PwaInstallPrompt from "@/components/pwa-install-prompt";
import RegisterServiceWorker from "@/components/register-service-worker";
import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#059669",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    manifest: "/manifest.webmanifest",
    icons: { icon: "/images/osidac-mark.svg", apple: "/images/icon-192.png" },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "OSIDAC",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <SiteChrome locale={locale} labels={{ nav: dict.nav, footer: dict.footer }}>
          {children}
        </SiteChrome>
        <PwaInstallPrompt labels={dict.pwa} />
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
