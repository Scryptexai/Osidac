import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import Icon from "@/components/ui/icon";
import { formatTierPrice, productTiers } from "@/lib/products/catalog";

const accents = {
  lime: "bg-[#d6f36a] text-[#171d19]",
  coral: "bg-[#f37959] text-[#171d19]",
  sky: "bg-[#9edbd5] text-[#171d19]",
  violet: "bg-[#c3b8f4] text-[#171d19]",
  gold: "bg-[#f3c45b] text-[#171d19]",
} as const;

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.app.products;

  return (
    <div className="space-y-5">
      <header className="market-ink-panel relative isolate overflow-hidden rounded-[1.5rem] border border-[#171d19]/20 p-5 sm:p-7 lg:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-12 h-52 w-52 rotate-12 rounded-[2.5rem] border-[24px] border-[#d6f36a]/15 sm:right-10 sm:top-[-5rem] sm:h-72 sm:w-72" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-[18%] hidden h-24 w-24 border-l border-t border-white/10 sm:block" />
        <div className="relative grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="max-w-2xl">
            <p className="market-kicker text-[#d6f36a]">{t.eyebrow}</p>
            <h1 className="mt-3 max-w-xl text-[2.25rem] font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl">{t.title}</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#f6f2e8]/70 sm:text-base">{t.subtitle}</p>
          </div>
          <div className="flex items-end justify-between gap-4 sm:block sm:text-right">
            <p className="market-kicker text-white/40">{t.productCode}</p>
            <p className="mt-1 font-mono text-4xl font-black tracking-[-0.08em] text-[#d6f36a] sm:text-5xl">01—05</p>
          </div>
        </div>
      </header>

      <section aria-label={t.eyebrow} className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
        {productTiers.map((tier, index) => (
          <article key={tier.tier} className="market-panel relative flex min-h-[276px] flex-col overflow-hidden p-4 sm:p-5">
            <div className={`absolute inset-x-0 top-0 h-1.5 ${accents[tier.accent].split(" ")[0]}`} />
            <div className="flex items-start justify-between gap-3">
              <p className="market-kicker text-[#716f63]">{t.tier} / {String(index + 1).padStart(2, "0")}</p>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accents[tier.accent]}`}>
                <Icon name="package" size={21} />
              </span>
            </div>

            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black leading-tight tracking-[-0.04em] sm:text-2xl">{tier.name}</h2>
                <p className="mt-2 text-2xl font-black tracking-[-0.055em] tabular-nums sm:text-3xl">{formatTierPrice(tier, locale)}</p>
              </div>
              <span className={`market-stamp mt-1 shrink-0 ${accents[tier.accent]}`}>{tier.osidMultiplier.toFixed(1)}×</span>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
              <div className="rounded-xl border border-[#171d19]/10 bg-[#f1eee3] p-3">
                <p className="market-kicker text-[#716f63]">{t.storeLevel}</p>
                <p className="mt-1 text-lg font-black">Lv.{tier.storeLevel}</p>
              </div>
              <div className="rounded-xl border border-[#171d19]/10 bg-[#f1eee3] p-3">
                <p className="market-kicker text-[#716f63]">{t.multiplier}</p>
                <p className="mt-1 text-lg font-black">{tier.osidMultiplier.toFixed(1)}× OSID</p>
              </div>
            </div>
            <p className="mt-2 text-[11px] font-semibold text-[#716f63]">{t.perCampaign}</p>
            <button type="button" disabled aria-disabled="true" className="market-lime-button mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-black">
              {t.checkoutStatus}
              <Icon name="lock" size={16} />
            </button>
          </article>
        ))}
      </section>

      <section className="market-panel grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3c45b] text-[#171d19]"><Icon name="bank" size={20} /></span>
          <div>
            <p className="market-kicker text-[#716f63]">{t.settlementTag}</p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#45483f]">{t.settlementNote} {t.checkoutNote}</p>
          </div>
        </div>
        <Link href={`/${locale}/app/misi`} className="market-lime-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-black">
          {t.browseMissions}
          <Icon name="arrowRight" size={17} />
        </Link>
      </section>
    </div>
  );
}
