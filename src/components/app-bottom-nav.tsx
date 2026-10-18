"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "@/components/ui/icon";

type Labels = {
  store: string;
  missions: string;
  products: string;
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
    { href: `/${locale}/app/produk`, icon: "package", label: labels.products },
    { href: `/${locale}/app/wallet`, icon: "wallet", label: labels.wallet },
    { href: `/${locale}/app/jaringan`, icon: "network", label: labels.network },
    { href: `/${locale}/app/wd`, icon: "bank", label: labels.withdraw },
  ];

  return (
    <nav
      className="fixed inset-x-2 bottom-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] z-40 mx-auto max-w-2xl rounded-[1.25rem] border border-white/10 bg-[#171d19]/[0.97] p-1.5 shadow-[0_12px_40px_rgb(0_0_0/0.25)] backdrop-blur-xl lg:hidden"
      aria-label={locale === "id" ? "Navigasi utama" : "Primary navigation"}
    >
      <div className="flex items-stretch gap-1">
        {items.map((item) => {
          const active = item.href === `/${locale}/app` ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[0.9rem] px-0.5 py-2 transition ${
                active
                  ? "bg-[#d6f36a] text-[#171d19]"
                  : "text-white/55 hover:bg-white/8 hover:text-white"
              }`}
            >
              <Icon name={item.icon} size={18} />
              <span className="max-w-full truncate text-[8px] font-black uppercase tracking-[0.04em] sm:text-[9px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
