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
        supabase
          .from("ledger_entries")
          .select("id, amount, currency, reference_type, memo, created_at")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

      const map: Record<string, number> = {};
      (walletRes.data ?? []).forEach((w) => {
        map[w.currency] = Number(w.balance);
      });
      setBalances(map);
      setRows((ledgerRes.data ?? []) as LedgerRow[]);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-sm text-zinc-500">
        {labels.loading}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black tracking-tight">{labels.title}</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: labels.coins, value: (balances.KOIN ?? 0).toLocaleString(), accent: true },
          { label: labels.cash, value: `Rp${(balances.IDR ?? 0).toLocaleString()}` },
          { label: labels.usd, value: `$${(balances.USD ?? 0).toLocaleString()}` },
        ].map((b) => (
          <div
            key={b.label}
            className={`rounded-2xl border p-6 ${
              b.accent
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40"
                : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            }`}
          >
            <p className="text-sm font-semibold text-zinc-500">{b.label}</p>
            <p className="mt-1 text-3xl font-black tabular-nums">{b.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 font-bold">{labels.history}</h2>
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700">
            {labels.empty}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
                <tr>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Memo</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-2.5 text-zinc-500">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium dark:bg-zinc-800">
                        {r.reference_type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-zinc-500">{r.memo ?? "—"}</td>
                    <td
                      className={`px-4 py-2.5 text-right font-bold tabular-nums ${
                        Number(r.amount) >= 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {Number(r.amount) >= 0 ? "+" : ""}
                      {Number(r.amount).toLocaleString()} {r.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
