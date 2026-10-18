import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import DailyMissions from "@/components/missions/daily-missions";
import Icon, { type IconName } from "@/components/ui/icon";

export default async function MissionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.app.missions;
  const routes: { code: string; icon: IconName; title: string; description: string; color: string }[] = [
    { code: "01 / INSTALL", icon: "phone", title: t.installTitle, description: t.installDescription, color: "bg-[#d6f36a]" },
    { code: "02 / PTC", icon: "cursor", title: t.ptcTitle, description: t.ptcDescription, color: "bg-[#f37959]" },
    { code: "03 / SOCIAL", icon: "atSign", title: t.followTitle, description: t.followDescription, color: "bg-[#9edbd5]" },
    { code: "04 / DISCOVER", icon: "missions", title: t.surveyTitle, description: t.surveyDescription, color: "bg-[#c3b8f4]" },
  ];

  return (
    <div className="space-y-5">
      <header className="market-ink-panel relative isolate grid overflow-hidden rounded-[1.5rem] border border-[#171d19]/20 sm:min-h-[260px] sm:grid-cols-[minmax(0,1fr)_0.75fr]">
        <div className="relative z-10 flex flex-col justify-center p-5 sm:p-7 lg:p-8">
          <p className="market-kicker text-[#d6f36a]">OSIDAC / FIELD ASSIGNMENTS</p>
          <h1 className="mt-3 max-w-xl text-[2.4rem] font-black leading-[0.94] tracking-[-0.06em] sm:text-5xl">{t.dailyTitle}</h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#f6f2e8]/70 sm:text-base">{t.dailySubtitle}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="market-stamp border-[#d6f36a]/45 text-[#d6f36a]">{t.progress}</span>
            <span className="market-stamp border-white/20 text-white/60">{t.reset}</span>
          </div>
        </div>
        <div className="relative min-h-36 overflow-hidden border-t border-white/10 sm:min-h-full sm:border-l sm:border-t-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/app-missions-slide.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171d19] via-[#171d19]/50 to-transparent sm:bg-gradient-to-l sm:from-[#171d19]/5 sm:via-[#171d19]/15 sm:to-[#171d19]/40" />
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-white/20 bg-[#171d19]/70 px-3 py-2 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#f37959]" />
            <span className="market-kicker text-white/80">{t.partnerFeedStatus}</span>
          </div>
        </div>
      </header>

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
          retry: t.retry,
        }}
      />

      <section className="market-ink-panel overflow-hidden rounded-[1.5rem] border border-[#171d19]/20 p-4 sm:p-5">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="market-kicker text-[#f37959]">PARTNER FEED / 00 LIVE</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">{t.partnerBoardTitle}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/60">{t.partnerBoardSubtitle}</p>
          </div>
          <span className="market-stamp w-fit border-[#f37959]/50 text-[#ffab91]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f37959]" />
            {t.partnerFeedStatus}
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          {routes.map((route) => (
            <article key={route.code} className="flex min-h-[198px] flex-col rounded-xl border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="market-kicker text-white/45">{route.code}</span>
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-[#171d19] ${route.color}`}><Icon name={route.icon} size={19} /></span>
              </div>
              <h3 className="mt-4 text-lg font-black tracking-tight">{route.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-white/55">{route.description}</p>
              <div className="mt-auto flex items-center gap-2 pt-4">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f37959]" />
                <span className="market-kicker text-[0.56rem] text-[#f6f2e8]/55">{t.waiting}</span>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-[#f37959]/20 bg-[#f37959]/[0.07] px-3 py-3 text-xs leading-relaxed text-[#f6f2e8]/75">
          <Icon name="info" size={16} className="mt-0.5 shrink-0 text-[#ffab91]" />
          {t.partnerFeedDescription} {t.inventoryNotice}
        </p>
        <Link href={`/${locale}/app/produk`} className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-black text-[#d6f36a] hover:text-white">
          {dict.app.sidebar.products}
          <Icon name="arrowRight" size={16} />
        </Link>
      </section>
    </div>
  );
}
