import { getDictionary } from "@/lib/i18n";
import Icon from "@/components/ui/icon";

export default async function WithdrawPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.app.withdraw;

  return (
    <div className="space-y-5 pb-2">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">OSIDAC</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight">{t.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{t.subtitle}</p>
      </header>

      <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-xl sm:p-6">
        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full border-[24px] border-white/5" />
        <div className="relative flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-emerald-200">
            <Icon name="shield" size={24} />
          </span>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/30 bg-amber-300/10 px-3 py-1 text-xs font-bold text-amber-100">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
              {t.status}
            </span>
            <p className="mt-3 max-w-xl text-base font-bold leading-relaxed">{t.soon}</p>
          </div>
        </div>
      </section>

      <section className="card-app p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
            <Icon name="bank" size={21} />
          </span>
          <div>
            <h2 className="font-black">{t.providerTitle}</h2>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{t.methods}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">{t.bankMethod}</span>
          <span className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">{t.walletMethod}</span>
        </div>
      </section>

      <p className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
        <Icon name="info" size={18} className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-300" />
        {t.min}
      </p>

      <p className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm leading-relaxed text-emerald-900 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-100">
        <Icon name="coins" size={18} className="mt-0.5 shrink-0" />
        {t.coinNote}
      </p>
    </div>
  );
}
