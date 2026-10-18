"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/language-switcher";
import YearNow from "@/components/year-now";

type Labels = {
  nav: {
    how: string;
    packages: string;
    earn: string;
    network: string;
    transparency: string;
    login: string;
    register: string;
  };
  footer: {
    tagline: string;
    legal: string;
    rights: string;
  };
};

export default function SiteChrome({
  children,
  locale,
  labels,
}: {
  children: ReactNode;
  locale: string;
  labels: Labels;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const isAppRoute = pathname.startsWith(`/${locale}/app`);

  return (
    <>
      {!isAppRoute && (
        <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/85 backdrop-blur-lg dark:border-zinc-800/70 dark:bg-zinc-950/85">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
            <Link
              href={`/${locale}`}
              aria-label="OSIDAC"
              className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/osidac-logo.svg" alt="OSIDAC" className="h-8 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400 lg:flex">
              <a href="#how" className="hover:text-zinc-900 dark:hover:text-zinc-100">{labels.nav.how}</a>
              <a href="#packages" className="hover:text-zinc-900 dark:hover:text-zinc-100">{labels.nav.packages}</a>
              <a href="#earn" className="hover:text-zinc-900 dark:hover:text-zinc-100">{labels.nav.earn}</a>
              <a href="#network" className="hover:text-zinc-900 dark:hover:text-zinc-100">{labels.nav.network}</a>
              <a href="#transparency" className="hover:text-zinc-900 dark:hover:text-zinc-100">{labels.nav.transparency}</a>
            </nav>
            <div className="flex items-center gap-2">
              <LanguageSwitcher current={locale} />
              <Link
                href={`/${locale}/login`}
                className="hidden rounded-full px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 sm:block"
              >
                {labels.nav.login}
              </Link>
              <Link
                href={`/${locale}/register`}
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-emerald-600"
              >
                {labels.nav.register}
              </Link>
            </div>
          </div>
        </header>
      )}

      <main>{children}</main>

      {!isAppRoute && (
        <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="mx-auto max-w-6xl space-y-3 px-4 pb-safe pt-8 text-sm text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2 font-semibold text-zinc-700 dark:text-zinc-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/osidac-mark.svg" alt="" className="h-7 w-7" />
              OSIDAC — {labels.footer.tagline}
            </div>
            <p className="max-w-3xl">{labels.footer.legal}</p>
            <p>© <YearNow /> OSIDAC. {labels.footer.rights}</p>
          </div>
        </footer>
      )}
    </>
  );
}
