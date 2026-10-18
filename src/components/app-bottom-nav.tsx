"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

const items = (locale: string) => {
  const labels =
    locale === "id"
      ? ["Toko", "Misi", "Dompet", "Jaringan", "Tarik"]
      : ["Store", "Missions", "Wallet", "Network", "Withdraw"];

  return [
    { href: `/${locale}/app`, icon: "🏪", label: labels[0] },
    { href: `/${locale}/app/misi`, icon: "🎯", label: labels[1] },
    { href: `/${locale}/app/wallet`, icon: "💰", label: labels[2] },
    { href: `/${locale}/app/jaringan`, icon: "🌐", label: labels[3] },
    { href: `/${locale}/app/wd`, icon: "🏦", label: labels[4] },
  ];
};

export default function AppBottomNav() {
  const pathname = usePathname() ?? "/";
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200/80 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg dark:border-zinc-800/80 dark:bg-zinc-950/95 md:hidden"
      aria-label={locale === "id" ? "Navigasi utama" : "Primary navigation"}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {items(locale).map((item) => {
          const active =
            item.href === `/${locale}/app`
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 pb-2 pt-2.5 text-[11px] font-semibold transition ${
                active
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <span className={`text-xl transition ${active ? "-translate-y-0.5 scale-110" : ""}`}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
              {active && <span className="mt-0.5 h-1 w-1 rounded-full bg-emerald-500" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
