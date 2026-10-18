import { getDictionary } from "@/lib/i18n";
import Icon, { type IconName } from "@/components/ui/icon";

export default async function WithdrawPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.app.withdraw;
  const stages: { icon: IconName; title: string; text: string }[] = [
    { icon: "receipt", title: t.stepRevenue, text: t.stepRevenueNote },
    { icon: "coins", title: t.stepValue, text: t.stepValueNote },
    { icon: "shield", title: t.stepReview, text: t.stepReviewNote },
  ];

  return (
    <div className="space-y-5">
      <header>
        <p className="market-kicker text-[#716f63]">OSIDAC / SETTLEMENT DESK</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">{t.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5e6057]">{t.subtitle}</p>
      </header>

      <section className="market-ink-panel relative overflow-hidden rounded-[1.4rem] border border-[#171d19]/20 p-5 sm:p-7">
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full border-[28px] border-white/[0.07]" />
        <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="max-w-2xl">
            <span className="market-stamp border-[#f37959]/45 text-[#ffab91]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f37959]" />
              {t.status}
            </span>
            <h2 className="mt-4 text-2xl font-black tracking-[-0.045em] sm:text-3xl">{t.soon}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{t.sourceDescription}</p>
          </div>
          <div className="relative rounded-xl border border-white/10 bg-white/[0.05] p-4 sm:min-w-48">
            <p className="market-kicker text-white/45">{t.sourceTitle}</p>
            <p className="mt-2 text-2xl font-black tracking-tight text-[#d6f36a]">OSID → IDR</p>
            <p className="mt-1 text-xs text-white/45">{t.variableRate}</p>
          </div>
        </div>
      </section>

      <section aria-label={t.flowTitle} className="grid gap-3 md:grid-cols-3">
        {stages.map((stage, index) => (
          <article key={stage.title} className="market-panel relative overflow-hidden p-4 sm:p-5">
            <p className="market-kicker text-[#8b8a7d]">0{index + 1} / {t.flowTitle}</p>
            <span className="mt-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9e5d8] text-[#171d19]"><Icon name={stage.icon} size={20} /></span>
            <h3 className="mt-4 text-lg font-black tracking-tight">{stage.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-[#68685e]">{stage.text}</p>
          </article>
        ))}
      </section>

      <section className="market-panel p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3c45b] text-[#171d19]"><Icon name="bank" size={19} /></span>
          <div>
            <h2 className="font-black">{t.providerTitle}</h2>
            <p className="mt-1 text-sm leading-relaxed text-[#68685e]">{t.methods}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="market-stamp border-[#171d19]/15 text-[#55574e]">{t.bankMethod}</span>
          <span className="market-stamp border-[#171d19]/15 text-[#55574e]">{t.walletMethod}</span>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <article className="market-panel p-4 sm:p-5">
          <p className="market-kicker text-[#716f63]">{t.feeTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-[#55574e]">{t.feeDescription}</p>
        </article>
        <p className="flex items-start gap-3 rounded-[1.2rem] border border-[#f37959]/30 bg-[#fff6ef] px-4 py-4 text-sm leading-relaxed text-[#613c30]">
          <Icon name="info" size={18} className="mt-0.5 shrink-0" />
          {t.coinNote}
        </p>
      </section>
    </div>
  );
}
