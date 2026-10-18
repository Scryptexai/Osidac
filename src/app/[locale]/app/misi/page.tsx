import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import DailyMissions from "@/components/missions/daily-missions";

export default async function MissionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.app.missions;

  return (
    <div className="space-y-5 pb-2">
      <div className="overflow-hidden rounded-[1.75rem] bg-zinc-900 text-white shadow-lg">
        <div className="relative min-h-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/missions.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/85 via-zinc-950/45 to-transparent" />
          <div className="relative max-w-xl p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">OSIDAC</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight">{t.dailyTitle}</h1>
            <p className="mt-1 text-sm text-white/80">{t.dailySubtitle}</p>
          </div>
        </div>
      </div>

      <DailyMissions
        locale={locale}
        labels={{
          dailyTitle: t.dailyTitle,
          dailySubtitle: t.dailySubtitle,
          rewardNote: t.rewardNote,
          progress: t.progress,
          reset: t.reset,
          checkInTitle: t.checkInTitle,
          checkInDescription: t.checkInDescription,
          checkInReward: t.checkInReward,
          inviteTitle: t.inviteTitle,
          inviteDescription: t.inviteDescription,
          inviteReward: t.inviteReward,
          shareTitle: t.shareTitle,
          shareDescription: t.shareDescription,
          shareButton: t.shareButton,
          shareSuccess: t.shareSuccess,
          shareError: t.shareError,
          linkMissing: t.linkMissing,
          storeTitle: t.storeTitle,
          storeDescription: t.storeDescription,
          storeButton: t.storeButton,
          claimButton: t.claimButton,
          claimed: t.claimed,
          completed: t.completed,
          notReady: t.notReady,
          loading: t.loading,
          error: t.error,
          disabled: t.disabled,
          coins: t.coins,
        }}
      />

      <section className="card-app p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-xl dark:bg-amber-950/40">🎮</span>
          <div>
            <h2 className="font-black">{t.offersTitle}</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t.offersSubtitle}</p>
          </div>
        </div>
        <p className="mt-4 rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:bg-zinc-800/70 dark:text-zinc-300">
          {t.offersSoon}
        </p>
        <Link href={`/${locale}/app/wallet`} className="mt-4 inline-flex min-h-11 items-center font-bold text-emerald-700 dark:text-emerald-300">
          {dict.app.sidebar.wallet} →
        </Link>
      </section>
    </div>
  );
}
