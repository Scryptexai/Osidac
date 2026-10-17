import { getDictionary } from "@/lib/i18n";

export default async function WalletPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.app.wallet;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black tracking-tight">{t.title}</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-semibold text-zinc-500">{t.coins}</p>
          <p className="mt-1 text-3xl font-black tabular-nums">0</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-semibold text-zinc-500">{t.cash}</p>
          <p className="mt-1 text-3xl font-black tabular-nums">0</p>
        </div>
      </div>
      <div>
        <h2 className="mb-3 font-bold">{t.history}</h2>
        <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700">
          {t.soon}
        </div>
      </div>
    </div>
  );
}
