"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "@/components/ui/icon";
import LogoutButton from "@/components/logout-button";

type Labels = {
  store: string;
  missions: string;
  products: string;
  wallet: string;
  network: string;
  withdraw: string;
  logout: string;
  navTitle: string;
  feedTitle: string;
  feedStatus: string;
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
    { href: `/${locale}/app/produk`, label: labels.products, icon: "package" },
    { href: `/${locale}/app/wallet`, label: labels.wallet, icon: "wallet" },
    { href: `/${locale}/app/jaringan`, label: labels.network, icon: "network" },
    { href: `/${locale}/app/wd`, label: labels.withdraw, icon: "bank" },
  ];

  return (
    <aside className="hidden lg:block">
      <nav
        aria-label={labels.navTitle}
        className="market-sidebar sticky top-[5.5rem] flex min-h-[calc(100dvh-7rem)] flex-col rounded-[1.4rem] p-3"
      >
        <div className="px-3 pb-3 pt-2">
          <p className="market-kicker text-white/45">{labels.navTitle}</p>
        </div>
        <div className="space-y-1">
          {items.map((item, index) => {
            const active = item.href === `/${locale}/app` ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-bold transition ${
                  active
                    ? "bg-[#d6f36a] text-[#171d19] shadow-[0_3px_0_rgb(0_0_0/0.25)]"
                    : "text-white/70 hover:bg-white/8 hover:text-white"
                }`}
              >
                <span className={`market-kicker w-5 text-[0.58rem] ${active ? "text-[#171d19]/55" : "text-white/30"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Icon name={item.icon} size={19} />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <Icon name="arrowRight" size={14} className={`transition ${active ? "opacity-80" : "opacity-0 group-hover:opacity-60"}`} />
              </Link>
            );
          })}
        </div>

        <div className="mt-auto space-y-3 pt-6">
          <section className="rounded-xl border border-white/10 bg-white/[0.045] p-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#f37959] shadow-[0_0_0_4px_rgb(243_121_89/0.12)]" />
              <p className="market-kicker text-white/75">{labels.feedTitle}</p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-white/50">{labels.feedStatus}</p>
          </section>
          <div className="border-t border-white/10 pt-2">
            <LogoutButton label={labels.logout} />
          </div>
        </div>
      </nav>
    </aside>
  );
}
