import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import AuthGuard from "@/components/auth-guard";
import LogoutButton from "@/components/logout-button";
import AppBottomNav from "@/components/app-bottom-nav";
import AppSidebar from "@/components/app-sidebar";
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

  return (
    <AuthGuard loadingLabel={dict.app.loading}>
      <RealtimeLedgerNotification labels={dict.app.notifications} />
      <div className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/90 backdrop-blur-lg dark:border-zinc-800/70 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5">
          <Link
            href={`/${locale}/app`}
            aria-label="OSIDAC"
            className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/osidac-logo.svg" alt="OSIDAC" className="h-8 w-auto" />
          </Link>
          <div className="md:hidden">
            <LogoutButton label="" compact />
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-28 pt-5 md:flex-row md:pb-10">
        <AppSidebar locale={locale} labels={dict.app.sidebar} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>

      <AppBottomNav
        locale={locale}
        labels={{
          store: dict.app.sidebar.store,
          missions: dict.app.sidebar.missions,
          wallet: dict.app.sidebar.wallet,
          network: dict.app.sidebar.network,
          withdraw: dict.app.sidebar.withdraw,
        }}
      />
    </AuthGuard>
  );
}
