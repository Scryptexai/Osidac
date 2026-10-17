import { getDictionary } from "@/lib/i18n";

export default async function WithdrawPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.app.withdraw;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">{t.title}</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">{t.subtitle}</p>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="font-semibold">{t.methods}</p>
        <p className="mt-2 text-sm text-zinc-500">{t.min}</p>
      </div>
      <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700">
        {t.soon}
      </div>
    </div>
  );
}
