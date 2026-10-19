import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import Icon, { type IconName } from "@/components/ui/icon";
import { formatPlannedTierPrice, plannedTiers } from "@/lib/products/catalog";

const accents = {
  lime: "bg-[#d6f36a] text-[#171d19]",
  coral: "bg-[#f37959] text-[#171d19]",
  sky: "bg-[#9edbd5] text-[#171d19]",
  violet: "bg-[#c3b8f4] text-[#171d19]",
  gold: "bg-[#f3c45b] text-[#171d19]",
} as const;

type Explanation = { icon: IconName; title: string; body: string; accent: keyof typeof accents };

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.app.products;
  const explanations: Explanation[] = [
    { icon: "store", title: t.tierStoreTitle, body: t.tierStoreBody, accent: "lime" },
    { icon: "coins", title: t.tierOsidTitle, body: t.tierOsidBody, accent: "coral" },
    { icon: "missions", title: t.tierAccessTitle, body: t.tierAccessBody, accent: "sky" },
  ];

  return (
    <div className="space-y-5">
      <header className="market-ink-panel relative isolate overflow-hidden rounded-[1.5rem] border border-[#171d19]/20 p-5 sm:p-7 lg:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-12 h-52 w-52 rotate-12 rounded-[2.5rem] border-[24px] border-[#d6f36a]/15 sm:right-10 sm:top-[-5rem] sm:h-72 sm:w-72" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-[18%] hidden h-24 w-24 border-l border-t border-white/10 sm:block" />
        <div className="relative grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="max-w-2xl">
            <p className="market-kicker text-[#d6f36a]">{t.eyebrow}</p>
            <h1 className="mt-3 max-w-xl text-[2.1rem] font-black leading-[1.02] tracking-[-0.055em] sm:text-5xl">{t.title}</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#f6f2e8]/75 sm:text-base">{t.subtitle}</p>
          </div>
          <div className="flex items-end justify-between gap-4 sm:block sm:text-right">
            <p className="market-kicker text-white/50">{t.productCode}</p>
            <p className="mt-1 font-mono text-4xl font-black tracking-[-0.08em] text-[#d6f36a] sm:text-5xl">01—05</p>
          </div>
        </div>
      </header>

      <section className="market-panel flex items-start gap-3 border-l-4 border-[#f37959] p-4 sm:p-5" aria-labelledby="package-status-title">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0e8] text-[#984630]">
          <Icon name="lock" size={19} />
        </span>
        <div className="min-w-0">
          <h2 id="package-status-title" className="font-black">{t.purchaseStatusTitle}</h2>
          <p className="mt-1 text-sm leading-relaxed text-[#55574e]">{t.purchaseStatus}</p>
        </div>
      </section>

      <section aria-labelledby="tier-effects-title" className="space-y-3">
        <div>
          <p className="market-kicker text-[#716f63]">{t.productCode}</p>
          <h2 id="tier-effects-title" className="mt-1 text-xl font-black tracking-tight sm:text-2xl">{t.tierEffectTitle}</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {explanations.map((item) => (
            <article key={item.title} className="market-panel flex items-start gap-3 p-4 sm:p-5">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accents[item.accent]}`}>
                <Icon name={item.icon} size={20} />
              </span>
              <div className="min-w-0">
                <h3 className="font-black leading-snug">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#55574e]">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="market-ink-panel grid gap-4 rounded-[1.25rem] p-4 text-white sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#d6f36a]">
            <Icon name="clock" size={20} />
          </span>
          <div className="min-w-0">
            <h2 className="font-black">{t.currentServiceTitle}</h2>
            <p className="mt-1 max-w-4xl text-sm leading-relaxed text-white/70">{t.currentServiceBody}</p>
          </div>
        </div>
        <Link href={`/${locale}/app`} className="market-lime-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-black">
          {t.currentServiceCta}
          <Icon name="arrowRight" size={17} />
        </Link>
      </section>

      <section aria-labelledby="tier-options-title" className="space-y-3">
        <div>
          <p className="market-kicker text-[#716f63]">{t.eyebrow}</p>
          <h2 id="tier-options-title" className="mt-1 text-xl font-black tracking-tight sm:text-2xl">{t.tierOptionsTitle}</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
          {plannedTiers.map((tier, index) => (
            <article key={tier.tier} className="market-panel relative flex min-h-[310px] flex-col overflow-hidden p-4 sm:p-5">
              <div className={`absolute inset-x-0 top-0 h-1.5 ${accents[tier.accent].split(" ")[0]}`} />
              <div className="flex items-start justify-between gap-3">
                <p className="market-kicker text-[#716f63]">{t.tier} / {String(index + 1).padStart(2, "0")}</p>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accents[tier.accent]}`}>
                  <Icon name="package" size={21} />
                </span>
              </div>

              <div className="mt-4 min-w-0">
                <h3 className="text-xl font-black leading-tight tracking-[-0.04em] sm:text-2xl">{tier.name}</h3>
                <p className="market-kicker mt-3 text-[#716f63]">{t.priceLabel}</p>
                <p className="mt-1 break-words text-2xl font-black tracking-[-0.055em] tabular-nums sm:text-3xl">{formatPlannedTierPrice(tier, locale)}</p>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                <div className="min-w-0 rounded-xl border border-[#171d19]/10 bg-[#f1eee3] p-3">
                  <p className="market-kicker text-[#716f63]">{t.storeLevel}</p>
                  <p className="mt-1 text-lg font-black">Lv.{tier.storeLevel}</p>
                </div>
                <div className="min-w-0 rounded-xl border border-[#171d19]/10 bg-[#f1eee3] p-3">
                  <p className="market-kicker text-[#716f63]">{t.multiplier}</p>
                  <p className="mt-1 text-lg font-black">{tier.missionMultiplier.toFixed(1)}×</p>
                </div>
              </div>
              <p className="mt-2 min-h-10 text-[11px] font-semibold leading-relaxed text-[#716f63]">{t.perCampaign}</p>
              <button type="button" disabled aria-disabled="true" className="market-lime-button mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-black">
                {t.checkoutStatus}
                <Icon name="lock" size={16} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="market-panel flex items-start gap-3 p-4 sm:p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3c45b] text-[#171d19]"><Icon name="bank" size={20} /></span>
        <div className="min-w-0">
          <p className="market-kicker text-[#716f63]">{t.settlementTag}</p>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-[#45483f]">{t.settlementNote} {t.checkoutNote}</p>
        </div>
      </section>
    </div>
  );
}
