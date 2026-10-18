"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Icon, { type IconName } from "@/components/ui/icon";

type LedgerRow = {
  id: string;
  amount: number;
  currency: string;
  reference_type: string;
  created_at: string;
};

type Labels = {
  title: string;
  coins: string;
  cash: string;
  cashNote: string;
  coinNote: string;
  history: string;
  loading: string;
  empty: string;
  locale: string;
  claimEntry: string;
  upgradeEntry: string;
  missionEntry: string;
  bonusEntry: string;
  otherEntry: string;
};

const ENTRY_ICONS: Record<string, IconName> = {
  claim_omzet: "store",
  store_upgrade: "arrowUp",
  mission_reward: "missions",
  bonus: "gift",
};

export default function WalletDashboard({ labels }: { labels: Labels }) {
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [rows, setRows] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    void (async () => {
      try {
        const supabase = createClient();
        const { data: userData } = await supabase.auth.getUser();
        const uid = userData.user?.id;
        if (!uid) return;
        const [walletRes, ledgerRes] = await Promise.all([
          supabase.from("wallets").select("currency, balance").eq("user_id", uid),
          supabase
            .from("ledger_entries")
            .select("id, amount, currency, reference_type, created_at")
            .eq("user_id", uid)
            .order("created_at", { ascending: false })
            .limit(50),
        ]);
        const nextBalances: Record<string, number> = {};
        (walletRes.data ?? []).forEach((wallet) => { nextBalances[wallet.currency] = Number(wallet.balance); });
        setBalances(nextBalances);
        setRows((ledgerRes.data ?? []) as LedgerRow[]);
      } catch {
        setBalances({});
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div role="status" className="flex min-h-44 items-center justify-center text-sm text-zinc-500">{labels.loading}</div>;

  const referenceLabels: Record<string, string> = {
    claim_omzet: labels.claimEntry,
    store_upgrade: labels.upgradeEntry,
    mission_reward: labels.missionEntry,
    bonus: labels.bonusEntry,
  };

  return (
    <div className="space-y-5 pb-2">
      <header className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          <Icon name="wallet" size={21} />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">OSIDAC</p>
          <h1 className="text-2xl font-black tracking-tight">{labels.title}</h1>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 text-white shadow-xl dark:from-zinc-800 dark:to-zinc-900 sm:p-6">
        <div className="pointer-events-none absolute -right-6 -top-12 h-40 w-40 rounded-full border-[24px] border-white/5" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white/70">{labels.coins}</p>
            <p className="mt-2 text-4xl font-black tabular-nums tracking-tight">
              {(balances.KOIN ?? 0).toLocaleString(labels.locale, { maximumFractionDigits: 2 })}
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-emerald-300">
            <Icon name="coins" size={25} />
          </span>
        </div>
        <p className="relative mt-3 max-w-xl text-xs leading-relaxed text-white/65">{labels.coinNote}</p>
      </section>

      <section className="card-app flex items-start gap-4 p-4 sm:p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
          <Icon name="bank" size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300">{labels.cash}</p>
            <p className="font-black tabular-nums">Rp{(balances.IDR ?? 0).toLocaleString(labels.locale, { maximumFractionDigits: 0 })}</p>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{labels.cashNote}</p>
        </div>
      </section>

      <section aria-labelledby="wallet-history-title">
        <h2 id="wallet-history-title" className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">{labels.history}</h2>
        {rows.length === 0 ? (
          <div className="card-app flex flex-col items-center px-6 py-9 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
              <Icon name="receipt" size={23} />
            </span>
            <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">{labels.empty}</p>
          </div>
        ) : (
          <div className="card-app divide-y divide-zinc-100 overflow-hidden dark:divide-zinc-800">
            {rows.map((row) => {
              const positive = Number(row.amount) >= 0;
              return (
                <article key={row.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${positive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"}`}>
                      <Icon name={ENTRY_ICONS[row.reference_type] ?? "receipt"} size={19} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{referenceLabels[row.reference_type] ?? labels.otherEntry}</p>
                      <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {new Date(row.created_at).toLocaleString(labels.locale, { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                  </div>
                  <p className={`shrink-0 text-sm font-black tabular-nums ${positive ? "text-emerald-700 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}>
                    {positive ? "+" : "−"}{Math.abs(Number(row.amount)).toLocaleString(labels.locale)} {row.currency}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
