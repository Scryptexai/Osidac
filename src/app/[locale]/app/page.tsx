import { getDictionary } from "@/lib/i18n";

export default async function StorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.app.store;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black tracking-tight">{t.title}</h1>

      <div className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white shadow-lg">
        <p className="text-sm font-medium opacity-90">{t.producing}</p>
        <p className="mt-2 text-5xl font-black tabular-nums">0.00</p>
        <p className="mt-1 text-sm opacity-90">OSID Coins</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            disabled
            className="rounded-full bg-white px-6 py-3 font-bold text-emerald-700 opacity-90"
          >
            {t.claim}
          </button>
          <span className="rounded-full bg-white/15 px-4 py-2 text-sm">{t.claimIn} 08:00:00</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[
          { label: t.level, value: "Lv.1" },
          { label: t.streak, value: "0 🔥" },
          { label: t.league, value: "Bronze" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700">
        {t.soon}
      </div>
    </div>
  );
}
