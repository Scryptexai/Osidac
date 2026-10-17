import { getDictionary } from "@/lib/i18n";

export default async function NetworkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.app.network;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black tracking-tight">{t.title}</h1>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t.branches, value: "0" },
          { label: t.commission, value: "0" },
          { label: t.rank, value: "Starter" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-semibold text-zinc-500">{t.invite}</p>
        <div className="mt-2 flex items-center gap-2">
          <code className="flex-1 truncate rounded-xl bg-zinc-100 px-4 py-2.5 text-sm dark:bg-zinc-800">
            osidac.app/r/USERNAME
          </code>
          <button disabled className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white opacity-60">
            Copy
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700">
        {t.soon}
      </div>
    </div>
  );
}
