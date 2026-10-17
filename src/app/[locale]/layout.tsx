import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import LanguageSwitcher from "@/components/language-switcher";
import YearNow from "@/components/year-now";
import "../globals.css";

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
        <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/80">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 font-black text-white">
                O
              </span>
              <span className="text-lg font-black tracking-tight">OSIDAC</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400 md:flex">
              <a href="#how" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                {dict.nav.how}
              </a>
              <a href="#packages" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                {dict.nav.packages}
              </a>
              <a href="#earn" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                {dict.nav.earn}
              </a>
              <a href="#network" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                {dict.nav.network}
              </a>
              <a href="#transparency" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                {dict.nav.transparency}
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <LanguageSwitcher current={locale} />
              <Link
                href={`/${locale}/login`}
                className="hidden rounded-full px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 sm:block"
              >
                {dict.nav.login}
              </Link>
              <Link
                href={`/${locale}/register`}
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
              >
                {dict.nav.register}
              </Link>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-6xl space-y-3 px-4 py-8 text-sm text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2 font-semibold text-zinc-700 dark:text-zinc-300">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 text-xs font-black text-white">
                O
              </span>
              OSIDAC — {dict.footer.tagline}
            </div>
            <p className="max-w-3xl">{dict.footer.legal}</p>
            <p>© <YearNow /> OSIDAC. {dict.footer.rights}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
