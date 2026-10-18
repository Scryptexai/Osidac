"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "@/components/ui/icon";
import LogoutButton from "@/components/logout-button";

type Labels = {
  store: string;
  missions: string;
  wallet: string;
  network: string;
  withdraw: string;
  logout: string;
};

export default function AppSidebar({
  locale,
  labels,
}: {
  locale: string;
  labels: Labels;
}) {
  const pathname = usePathname() ?? "/";
  const items: { href: string; label: string; icon: IconName }[] = [
    { href: `/${locale}/app`, label: labels.store, icon: "store" },
    { href: `/${locale}/app/misi`, label: labels.missions, icon: "missions" },
    { href: `/${locale}/app/wallet`, label: labels.wallet, icon: "wallet" },
    { href: `/${locale}/app/jaringan`, label: labels.network, icon: "network" },
    { href: `/${locale}/app/wd`, label: labels.withdraw, icon: "bank" },
  ];

  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <nav aria-label={locale === "id" ? "Navigasi aplikasi" : "App navigation"} className="sticky top-24 flex flex-col gap-1">
        {items.map((item) => {
          const active = item.href === `/${locale}/app` ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-semibold transition ${
                active
                  ? "bg-emerald-50 text-emerald-800 shadow-sm dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <Icon name={item.icon} size={19} />
              {item.label}
            </Link>
          );
        })}
        <div className="mt-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
          <LogoutButton label={labels.logout} />
        </div>
      </nav>
    </aside>
  );
}
