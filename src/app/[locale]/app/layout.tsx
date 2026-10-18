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
        <header className="market-topbar sticky top-0 z-30">
          <div className="mx-auto flex min-h-[4.4rem] max-w-[1480px] items-center justify-between gap-3 px-3 py-2 sm:px-5 lg:px-6">
            <Link
              href={`/${locale}/app`}
              aria-label="OSIDAC"
              className="inline-flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5e7b22]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/osidac-mark.svg" alt="" className="h-9 w-9 shrink-0" />
              <span className="flex min-w-0 flex-col leading-none">
                <span className="text-[1.1rem] font-black tracking-[-0.075em]">OSIDAC</span>
                <span className="market-kicker mt-1 max-w-[8rem] truncate whitespace-nowrap text-[0.48rem] text-[#716f63]">{app.chrome.subbrand}</span>
              </span>
            </Link>

            <p className="market-kicker hidden text-[#716f63] xl:block">{app.chrome.workspace}</p>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <span className="market-stamp hidden whitespace-nowrap border-[#c8c3b5] text-[#716f63] md:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f37959]" />
                {app.chrome.feedStatus}
              </span>
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
