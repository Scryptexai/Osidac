"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "@/components/ui/icon";

type Labels = {
  store: string;
  missions: string;
  wallet: string;
  network: string;
  withdraw: string;
};

export default function AppBottomNav({
  locale,
  labels,
}: {
  locale: string;
  labels: Labels;
}) {
  const pathname = usePathname() ?? "/";
  const items: { href: string; icon: IconName; label: string }[] = [
    { href: `/${locale}/app`, icon: "store", label: labels.store },
    { href: `/${locale}/app/misi`, icon: "missions", label: labels.missions },
    { href: `/${locale}/app/wallet`, icon: "wallet", label: labels.wallet },
    { href: `/${locale}/app/jaringan`, icon: "network", label: labels.network },
    { href: `/${locale}/app/wd`, icon: "bank", label: labels.withdraw },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200/80 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg dark:border-zinc-800/80 dark:bg-zinc-950/95 md:hidden"
      aria-label={locale === "id" ? "Navigasi utama" : "Primary navigation"}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {items.map((item) => {
          const active = item.href === `/${locale}/app` ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 pb-2 pt-2.5 text-[10px] font-semibold transition sm:text-[11px] ${
                active
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <Icon name={item.icon} size={20} className={active ? "-translate-y-0.5 transition-transform" : ""} />
              <span className="max-w-full truncate">{item.label}</span>
              {active && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-emerald-500" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
