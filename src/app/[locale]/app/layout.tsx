import Link from "next/link";
import { getDictionary, type Dictionary } from "@/lib/i18n";

const navItems = (dict: Dictionary, locale: string) => [
  { href: `/${locale}/app`, label: dict.app.sidebar.store, icon: "🏪" },
  { href: `/${locale}/app/misi`, label: dict.app.sidebar.missions, icon: "🎯" },
  { href: `/${locale}/app/wallet`, label: dict.app.sidebar.wallet, icon: "💰" },
  { href: `/${locale}/app/jaringan`, label: dict.app.sidebar.network, icon: "🌐" },
  { href: `/${locale}/app/wd`, label: dict.app.sidebar.withdraw, icon: "🏦" },
];

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row">
      <aside className="w-full shrink-0 md:w-56">
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {navItems(dict, locale).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
