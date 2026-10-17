import { getDictionary } from "@/lib/i18n";

export default async function MissionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.app.missions;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">{t.title}</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">{t.subtitle}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { icon: "📲", name: "App install offers", pay: "$0.50 – $4" },
          { icon: "🎮", name: "Game milestones", pay: "$2 – $150" },
          { icon: "📋", name: "Surveys", pay: "$0.30 – $3" },
          { icon: "📺", name: "Rewarded ads", pay: "Energy & coins" },
        ].map((m) => (
          <div key={m.name} className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{m.icon}</span>
              <span className="font-semibold">{m.name}</span>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              {m.pay}
            </span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700">
        {t.soon}
      </div>
    </div>
  );
}
