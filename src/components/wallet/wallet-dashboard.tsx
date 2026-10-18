"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type LedgerRow = {
  id: string;
  amount: number;
  currency: string;
  reference_type: string;
  memo: string | null;
  created_at: string;
};

type Labels = {
  title: string;
  coins: string;
  cash: string;
  usd: string;
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

export default function WalletDashboard({ labels }: { labels: Labels }) {
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [rows, setRows] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    (async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const [walletRes, ledgerRes] = await Promise.all([
        supabase.from("wallets").select("currency, balance").eq("user_id", uid),
        supabase.from("ledger_entries").select("id, amount, currency, reference_type, memo, created_at").eq("user_id", uid).order("created_at", { ascending: false }).limit(50),
      ]);
      const map: Record<string, number> = {};
      (walletRes.data ?? []).forEach((w) => { map[w.currency] = Number(w.balance); });
      setBalances(map);
      setRows((ledgerRes.data ?? []) as LedgerRow[]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32 text-sm text-zinc-500">{labels.loading}</div>;

  const referenceLabels: Record<string, string> = {
    claim_omzet: labels.claimEntry,
    store_upgrade: labels.upgradeEntry,
    mission_reward: labels.missionEntry,
    bonus: labels.bonusEntry,
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-black tracking-tight">{labels.title}</h1>

      {/* Total card */}
      <div className="rounded-[2rem] bg-zinc-900 p-6 text-white shadow-xl dark:bg-zinc-800">
        <p className="text-sm font-semibold opacity-70">{labels.coins}</p>
        <p className="mt-1 text-4xl font-black tabular-nums">{(balances.KOIN ?? 0).toLocaleString()}</p>
        <div className="mt-4 flex gap-3">
          <div className="flex-1 rounded-2xl bg-white/10 p-3 backdrop-blur">
            <p className="text-xs opacity-60">{labels.cash}</p>
            <p className="mt-1 font-black">Rp{(balances.IDR ?? 0).toLocaleString()}</p>
          </div>
          <div className="flex-1 rounded-2xl bg-white/10 p-3 backdrop-blur">
            <p className="text-xs opacity-60">{labels.usd}</p>
            <p className="mt-1 font-black">${(balances.USD ?? 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* History — app list style */}
      <div>
        <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-zinc-500">{labels.history}</h2>
        {rows.length === 0 ? (
          <div className="card-app p-8 text-center">
            <p className="text-3xl">📭</p>
            <p className="mt-2 text-sm font-medium text-zinc-500">{labels.empty}</p>
          </div>
        ) : (
          <div className="card-app divide-y divide-zinc-100 overflow-hidden dark:divide-zinc-800">
            {rows.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-bold">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${Number(r.amount) >= 0 ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40" : "bg-red-100 text-red-600 dark:bg-red-900/40"}`}>
                      {Number(r.amount) >= 0 ? "+" : "−"}
                    </span>
                    <span className="truncate">{referenceLabels[r.reference_type] ?? labels.otherEntry}</span>
                  </p>
                  <p className="ml-10 truncate text-xs text-zinc-500">
                    {new Date(r.created_at).toLocaleDateString(labels.locale)} · {r.memo ?? "—"}
                  </p>
                </div>
                <p className={`ml-3 shrink-0 text-sm font-black tabular-nums ${Number(r.amount) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {Number(r.amount) >= 0 ? "+" : ""}{Number(r.amount).toLocaleString()} {r.currency}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
