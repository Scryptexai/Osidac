import Link from "next/link";
import { getDictionary, type Dictionary } from "@/lib/i18n";

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

  const earnCards = [
    { title: dict.earn.storeTitle, text: dict.earn.storeText, icon: "🏪" },
    { title: dict.earn.missionTitle, text: dict.earn.missionText, icon: "🎯" },
    { title: dict.earn.playTitle, text: dict.earn.playText, icon: "🎮" },
    { title: dict.earn.teamTitle, text: dict.earn.teamText, icon: "🌐" },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(16,185,129,0.12),transparent)]" />
        <div className="mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
            {dict.hero.badge}
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
            {dict.hero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            {dict.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${locale}/register`}
              className="rounded-full bg-emerald-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600"
            >
              {dict.hero.ctaPrimary}
            </Link>
            <a
              href="#how"
              className="rounded-full border border-zinc-300 px-7 py-3.5 text-base font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              {dict.hero.ctaSecondary}
            </a>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <span>✓ {dict.hero.stat1}</span>
            <span>✓ {dict.hero.stat2}</span>
            <span>✓ {dict.hero.stat3}</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-black tracking-tight md:text-4xl">{dict.how.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-600 dark:text-zinc-400">{dict.how.subtitle}</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { t: dict.how.buyTitle, d: dict.how.buyText, n: "💳" },
              { t: dict.how.getTitle, d: dict.how.getText, n: "✨" },
              { t: dict.how.wdTitle, d: dict.how.wdText, n: "🏦" },
            ].map((step) => (
              <div key={step.t} className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-3xl">{step.n}</div>
                <h3 className="mt-4 text-xl font-bold">{step.t}</h3>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-black tracking-tight md:text-4xl">{dict.packages.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-600 dark:text-zinc-400">{dict.packages.subtitle}</p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {tiers.map((tier, i) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-3xl border p-6 ${
                  i === 1
                    ? "border-emerald-500 shadow-lg shadow-emerald-500/10"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {i === 1 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                    {dict.packages.mostPopular}
                  </span>
                )}
                <h3 className="font-bold">{tier.name}</h3>
                <p className="mt-2 text-2xl font-black">{tier.price}</p>
                <p className="mt-3 flex-1 text-sm text-zinc-600 dark:text-zinc-400">{tier.desc}</p>
                <Link
                  href={`/${locale}/register`}
                  className={`mt-5 rounded-full py-2.5 text-center text-sm font-semibold ${
                    i === 1
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "border border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                  }`}
                >
                  {dict.packages.buy}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EARN */}
      <section id="earn" className="border-t border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-black tracking-tight md:text-4xl">{dict.earn.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-600 dark:text-zinc-400">{dict.earn.subtitle}</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {earnCards.map((card) => (
              <div key={card.title} className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-3xl">{card.icon}</div>
                <h3 className="mt-3 font-bold">{card.title}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NETWORK */}
      <section id="network" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-black tracking-tight md:text-4xl">{dict.network.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-600 dark:text-zinc-400">{dict.network.subtitle}</p>
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              { t: dict.network.l1, p: "8%" },
              { t: dict.network.l2, p: "3%" },
              { t: dict.network.l3, p: "1%" },
            ].map((level) => (
              <div key={level.t} className="rounded-3xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-4xl font-black text-emerald-500">{level.p}</p>
                <p className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">{level.t}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-zinc-500 dark:text-zinc-400">{dict.network.note}</p>
        </div>
      </section>

      {/* TRANSPARENCY */}
      <section id="transparency" className="border-t border-zinc-200 bg-emerald-50 py-20 dark:border-emerald-950 dark:bg-emerald-950/30">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">{dict.transparency.title}</h2>
          <p className="mt-4 text-zinc-700 dark:text-zinc-300">{dict.transparency.subtitle}</p>
          <p className="mt-6 rounded-2xl border border-emerald-200 bg-white px-6 py-4 font-mono text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-zinc-900 dark:text-emerald-300">
            {dict.transparency.formula}
          </p>
          <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">{dict.transparency.disclaimer}</p>
          <Link
            href={`/${locale}/register`}
            className="mt-8 inline-block rounded-full bg-emerald-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600"
          >
            {dict.hero.ctaPrimary}
          </Link>
        </div>
      </section>
    </>
  );
}
