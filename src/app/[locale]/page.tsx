import Link from "next/link";
import { getDictionary, type Dictionary } from "@/lib/i18n";
import Icon, { type IconName } from "@/components/ui/icon";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict: Dictionary = await getDictionary(locale);

  const tiers = [
    dict.packages.tiers.starter,
    dict.packages.tiers.kios,
    dict.packages.tiers.gold,
    dict.packages.tiers.elite,
    dict.packages.tiers.master,
  ];
  const proofItems: { icon: IconName; label: string }[] = [
    { icon: "clock", label: dict.proof.claim },
    { icon: "missions", label: dict.proof.engines },
    { icon: "bank", label: dict.proof.cashout },
    { icon: "network", label: dict.proof.langs },
  ];
  const earnCards: { icon: IconName; hook: string; text: string }[] = [
    { icon: "store", hook: dict.earn.storeHook, text: dict.earn.storeText },
    { icon: "missions", hook: dict.earn.missionHook, text: dict.earn.missionText },
    { icon: "award", hook: dict.earn.playHook, text: dict.earn.playText },
    { icon: "network", hook: dict.earn.teamHook, text: dict.earn.teamText },
  ];

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-600 via-emerald-500 to-teal-600 text-white">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="mx-auto max-w-5xl px-5 pb-8 pt-10 text-center md:pt-14">
          <span className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-bold backdrop-blur">
            {dict.hero.badge}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-[2.35rem] font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {dict.hero.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-emerald-50/95 sm:text-lg md:text-xl">
            {dict.hero.subtitle}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`/${locale}/register`}
              className="w-full rounded-2xl bg-white px-8 py-4 text-lg font-black text-emerald-700 shadow-xl shadow-emerald-900/20 transition hover:bg-emerald-50 sm:w-auto"
            >
              {dict.hero.ctaPrimary}
            </Link>
            <a
              href="#transparency"
              className="w-full rounded-2xl border-2 border-white/40 px-8 py-4 text-lg font-bold text-white backdrop-blur transition hover:bg-white/10 sm:w-auto"
            >
              {dict.hero.ctaSecondary}
            </a>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {[dict.hero.stat1, dict.hero.stat2, dict.hero.stat3].map((s) => (
              <span
                key={s}
                className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold backdrop-blur"
              >
                ✓ {s}
              </span>
            ))}
          </div>
        </div>

        {/* Hero image */}
        <div className="relative mx-auto max-w-3xl px-5 pb-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero.jpg"
            alt={dict.hero.imageAlt}
            className="w-full rounded-[2rem] border-4 border-white/25 shadow-2xl shadow-emerald-900/30"
          />
        </div>

        {/* Proof strip */}
        <div className="border-t border-white/15 bg-emerald-700/40">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 px-5 py-5 text-center sm:grid-cols-4">
            {proofItems.map((p) => (
              <div key={p.label} className="flex items-center justify-center gap-2 text-sm font-bold">
                <Icon name={p.icon} size={17} />
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" className="bg-zinc-50 py-16 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-3xl font-black tracking-tight md:text-5xl">
            {dict.how.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-600 dark:text-zinc-400">
            {dict.how.subtitle}
          </p>

          <div className="mt-10 space-y-6">
            {[
              {
                n: "1",
                hook: dict.how.buyHook,
                text: dict.how.buyText,
                img: "/images/store.jpg",
                alt: dict.how.buyAlt,
              },
              {
                n: "2",
                hook: dict.how.getHook,
                text: dict.how.getText,
                img: "/images/missions.jpg",
                alt: dict.how.getAlt,
              },
              {
                n: "3",
                hook: dict.how.wdHook,
                text: dict.how.wdText,
                img: "/images/withdraw.jpg",
                alt: dict.how.wdAlt,
              },
            ].map((step, i) => (
              <div
                key={step.n}
                className={`card-app overflow-hidden md:flex ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="relative md:w-1/2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={step.img} alt={step.alt} className="h-56 w-full object-cover md:h-full" />
                  <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-lg font-black text-white shadow-lg">
                    {step.n}
                  </span>
                </div>
                <div className="flex flex-col justify-center p-7 md:w-1/2">
                  <h3 className="text-2xl font-black leading-tight">{step.hook}</h3>
                  <p className="mt-3 text-zinc-600 dark:text-zinc-400">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= EARN ENGINES ================= */}
      <section id="earn" className="py-16">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-3xl font-black tracking-tight md:text-5xl">
            {dict.earn.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-600 dark:text-zinc-400">
            {dict.earn.subtitle}
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {earnCards.map((card) => (
              <div key={card.hook} className="card-app p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                  <Icon name={card.icon} size={23} />
                </div>
                <h3 className="mt-4 text-xl font-black">{card.hook}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PACKAGES (mobile carousel) ================= */}
      <section id="packages" className="border-y border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-3xl font-black tracking-tight md:text-5xl">
            {dict.packages.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-600 dark:text-zinc-400">
            {dict.packages.subtitle}
          </p>
          <p className="mx-auto mt-3 max-w-2xl rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-center text-xs font-semibold leading-relaxed text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            {dict.packages.accessNote}
          </p>
          <p className="mt-2 text-center text-sm font-semibold text-emerald-600 md:hidden">
            {dict.packages.swipe}
          </p>
        </div>

        <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-auto md:max-w-5xl md:grid md:grid-cols-5 md:overflow-visible">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="card-app relative flex w-64 shrink-0 snap-center flex-col p-6 md:w-auto"
            >
              <h3 className="font-black">{tier.name}</h3>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">{dict.packages.priceLabel}</p>
              <p className="mt-1 text-3xl font-black">{tier.price}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{tier.desc}</p>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="mt-5 min-h-11 cursor-not-allowed rounded-full border-2 border-zinc-200 py-3 text-center text-sm font-bold text-zinc-500 opacity-75 dark:border-zinc-700"
              >
                {dict.packages.notForSale}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= NETWORK ================= */}
      <section id="network" className="py-16">
        <div className="mx-auto max-w-5xl space-y-10 px-5">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">
              {dict.network.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
              {dict.network.subtitle}
            </p>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/network.jpg"
            alt={dict.network.imageAlt}
            className="mx-auto w-full max-w-3xl rounded-[2rem] shadow-xl"
          />

          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-3">
            {[dict.network.l1, dict.network.l2, dict.network.l3].map((level, index) => (
              <div key={level} className="card-app p-4 text-center sm:p-5">
                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 md:text-3xl">0{index + 1}</p>
                <p className="mt-2 text-xs font-semibold text-zinc-500 md:text-sm">{level}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto max-w-2xl text-center text-sm text-zinc-500 dark:text-zinc-400">
            {dict.network.note}
          </p>
        </div>
      </section>

      {/* ================= TRANSPARENCY ================= */}
      <section id="transparency" className="bg-gradient-to-b from-emerald-600 to-teal-700 py-16 text-white">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">
            {dict.transparency.title}
          </h2>
          <p className="mt-4 text-emerald-50/95">{dict.transparency.subtitle}</p>
          <p className="mt-6 rounded-2xl border border-white/25 bg-white/15 px-6 py-4 font-mono text-sm font-bold backdrop-blur">
            {dict.transparency.formula}
          </p>
          <p className="mt-6 text-sm text-emerald-100/90">{dict.transparency.disclaimer}</p>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-zinc-50 py-16 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <h2 className="text-3xl font-black leading-tight tracking-tight md:text-5xl">
            {dict.cta.title}
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">{dict.cta.subtitle}</p>
          <Link
            href={`/${locale}/register`}
            className="mt-8 inline-block w-full rounded-2xl bg-emerald-500 px-10 py-4 text-lg font-black text-white shadow-xl shadow-emerald-500/30 transition hover:bg-emerald-600 sm:w-auto"
          >
            {dict.cta.button}
          </Link>
        </div>
      </section>
    </>
  );
}
