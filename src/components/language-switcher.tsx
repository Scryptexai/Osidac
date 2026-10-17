"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";

const labels: Record<Locale, string> = { en: "EN", id: "ID" };

export default function LanguageSwitcher({ current }: { current: string }) {
  const pathname = usePathname() ?? "/";

  function swapPath(target: string) {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-zinc-200 dark:border-zinc-800 p-1">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={swapPath(locale)}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
            locale === current
              ? "bg-emerald-500 text-white"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          }`}
        >
          {labels[locale]}
        </Link>
      ))}
    </div>
  );
}
