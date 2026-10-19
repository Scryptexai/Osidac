import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import AuthGuard from "@/components/auth-guard";
import LogoutButton from "@/components/logout-button";
import AppBottomNav from "@/components/app-bottom-nav";
import AppSidebar from "@/components/app-sidebar";
import LanguageSwitcher from "@/components/language-switcher";
import RealtimeLedgerNotification from "@/components/wallet/realtime-ledger-notification";

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const app = dict.app;

  return (
    <AuthGuard loadingLabel={app.loading}>
      <div className="market-shell">
        <RealtimeLedgerNotification labels={app.notifications} />
        <header className="market-topbar sticky top-0 z-30 pt-[env(safe-area-inset-top,0px)]">
          <div className="mx-auto grid min-h-[4.4rem] max-w-[1480px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-2 sm:gap-3 sm:px-5 lg:px-6">
            <Link
              href={`/${locale}/app`}
              aria-label="OSIDAC"
              className="flex min-w-0 items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5e7b22] sm:gap-2.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/osidac-mark.svg" alt="" className="h-9 w-9 shrink-0" />
              <span className="min-w-0 truncate whitespace-nowrap text-[1.05rem] font-black tracking-[-0.075em] sm:text-[1.1rem]">OSIDAC</span>
            </Link>

            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <LanguageSwitcher current={locale} />
              <div className="lg:hidden">
                <LogoutButton label={app.sidebar.logout} compact />
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-[1480px] gap-4 px-3 py-4 sm:px-5 lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-5 lg:px-6 lg:py-5">
          <AppSidebar locale={locale} labels={{ ...app.sidebar, ...app.chrome }} />
          <main className="min-w-0 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] lg:pb-8">{children}</main>
        </div>

        <AppBottomNav
          locale={locale}
          labels={{
            store: app.sidebar.store,
            missions: app.sidebar.missions,
            products: app.sidebar.products,
            wallet: app.sidebar.wallet,
            network: app.sidebar.network,
            withdraw: app.sidebar.withdraw,
          }}
        />
      </div>
    </AuthGuard>
  );
}
