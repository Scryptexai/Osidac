"use client";

import { useCallback, useEffect, useState } from "react";
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
  coinsMissing: string;
  cash: string;
  cashNote: string;
  cashMissing: string;
  osidTitle: string;
  osidStatus: string;
  osidNote: string;
  coinNote: string;
  history: string;
  loading: string;
  empty: string;
  error: string;
  sessionError: string;
  retry: string;
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

function formatIdr(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function WalletDashboard({ labels }: { labels: Labels }) {
  const [balances, setBalances] = useState<Record<string, number> | null>(null);
  const [rows, setRows] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const uid = userData.user?.id;
      if (!uid) {
        setBalances(null);
        setRows([]);
        setError(labels.sessionError);
        return;
      }

      const [walletRes, ledgerRes] = await Promise.all([
        supabase.from("wallets").select("currency, balance").eq("user_id", uid),
        supabase
          .from("ledger_entries")
          .select("id, amount, currency, reference_type, created_at")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);
      if (walletRes.error) throw walletRes.error;
      if (ledgerRes.error) throw ledgerRes.error;

      const nextBalances: Record<string, number> = {};
      (walletRes.data ?? []).forEach((wallet) => {
        const value = Number(wallet.balance);
        if (Number.isFinite(value)) nextBalances[wallet.currency] = value;
      });
      setBalances(nextBalances);
      setRows((ledgerRes.data ?? []) as LedgerRow[]);
    } catch {
      setBalances(null);
      setRows([]);
      setError(labels.error);
    } finally {
      setLoading(false);
    }
  }, [labels.error, labels.sessionError]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const referenceLabels: Record<string, string> = {
    claim_omzet: labels.claimEntry,
    store_upgrade: labels.upgradeEntry,
    mission_reward: labels.missionEntry,
    bonus: labels.bonusEntry,
  };

  if (loading) return <div role="status" className="flex min-h-44 items-center justify-center text-sm text-zinc-500">{labels.loading}</div>;

  if (error || balances === null) {
    return (
      <div className="space-y-5 pb-2">
        <header className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d6f36a] text-[#171d19]">
            <Icon name="wallet" size={21} />
          </span>
          <div className="min-w-0">
            <p className="market-kicker text-[#716f63]">OSIDAC / WALLET LEDGER</p>
            <h1 className="text-2xl font-black tracking-tight">{labels.title}</h1>
          </div>
        </header>
        <section className="market-panel p-5 text-center">
          <p role="alert" className="text-sm leading-relaxed text-[#55574e]">{error ?? labels.error}</p>
          <button type="button" onClick={() => void load()} className="market-lime-button mt-4 min-h-11 rounded-xl px-5 text-sm font-black">{labels.retry}</button>
        </section>
      </div>
    );
  }

  const idrBalance = balances.IDR;

  return (
    <div className="space-y-5 pb-2">
      <header className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d6f36a] text-[#171d19]">
          <Icon name="wallet" size={21} />
        </span>
        <div className="min-w-0">
          <p className="market-kicker text-[#716f63]">OSIDAC / WALLET LEDGER</p>
          <h1 className="text-2xl font-black tracking-tight">{labels.title}</h1>
        </div>
      </header>

      <section className="market-ink-panel relative overflow-hidden rounded-[1.35rem] border border-[#171d19]/20 p-5 text-white sm:p-6">
        <div className="pointer-events-none absolute -right-6 -top-12 h-40 w-40 rounded-full border-[24px] border-white/5" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white/70">{labels.coins}</p>
            <p className="mt-2 break-words text-4xl font-black tabular-nums tracking-tight">
              {balances.KOIN === undefined ? labels.coinsMissing : balances.KOIN.toLocaleString(labels.locale, { maximumFractionDigits: 2 })}
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#d6f36a]">
            <Icon name="coins" size={25} />
          </span>
        </div>
        <p className="relative mt-3 max-w-xl text-xs leading-relaxed text-white/65">{labels.coinNote}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <article className="market-panel flex items-start gap-4 p-4 sm:p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3c45b] text-[#171d19]">
            <Icon name="bank" size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-bold text-[#55574e]">{labels.cash}</p>
              <p className="font-black tabular-nums">
                {idrBalance === undefined ? labels.cashMissing : formatIdr(idrBalance, labels.locale)}
              </p>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-[#68685e]">{labels.cashNote}</p>
          </div>
        </article>

        <article className="market-panel flex items-start gap-4 p-4 sm:p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c3b8f4] text-[#171d19]">
            <Icon name="coins" size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#55574e]">{labels.osidTitle}</p>
            <p className="mt-1 font-black">{labels.osidStatus}</p>
            <p className="mt-1 text-xs leading-relaxed text-[#68685e]">{labels.osidNote}</p>
          </div>
        </article>
      </section>

      <section aria-labelledby="wallet-history-title">
        <h2 id="wallet-history-title" className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-[#716f63]">{labels.history}</h2>
        {rows.length === 0 ? (
          <div className="market-panel flex flex-col items-center px-6 py-9 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1eee3] text-[#716f63]">
              <Icon name="receipt" size={23} />
            </span>
            <p className="mt-3 text-sm font-medium text-[#68685e]">{labels.empty}</p>
          </div>
        ) : (
          <div className="market-panel divide-y divide-[#171d19]/10 overflow-hidden">
            {rows.map((row) => {
              const positive = Number(row.amount) >= 0;
              return (
                <article key={row.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${positive
                      ? "bg-[#eaf2d3] text-[#465c17]"
                      : "bg-[#fff0e8] text-[#984630]"}`}>
                      <Icon name={ENTRY_ICONS[row.reference_type] ?? "receipt"} size={19} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{referenceLabels[row.reference_type] ?? labels.otherEntry}</p>
                      <p className="mt-0.5 truncate text-xs text-[#716f63]">
                        {new Date(row.created_at).toLocaleString(labels.locale, { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                  </div>
                  <p className={`shrink-0 text-sm font-black tabular-nums ${positive ? "text-[#465c17]" : "text-[#984630]"}`}>
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
