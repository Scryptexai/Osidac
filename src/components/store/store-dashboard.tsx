"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Store = {
  level: number;
  speed_multiplier: number;
  streak_days: number;
  league: string;
  last_claim_at: string | null;
};

type Labels = {
  title: string;
  level: string;
  producing: string;
  claimIn: string;
  claim: string;
  claimed: string;
  streak: string;
  league: string;
  upgrade: string;
  upgradeDone: string;
  insufficient: string;
  coins: string;
  cost: string;
  loading: string;
  error: string;
};

const CLAIM_INTERVAL_MS = 8 * 60 * 60 * 1000;

function fmtCountdown(ms: number) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

function upgradeCost(level: number) {
  return Math.round(500 * Math.pow(level, 1.6) * 100) / 100;
}

export default function StoreDashboard({ labels }: { labels: Labels }) {
  const [store, setStore] = useState<Store | null>(null);
  const [balance, setBalance] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState<"claim" | "upgrade" | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loaded = useRef(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) return;

    const [storeRes, walletRes] = await Promise.all([
      supabase
        .from("virtual_stores")
        .select("level, speed_multiplier, streak_days, league, last_claim_at")
        .eq("user_id", uid)
        .single(),
      supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", uid)
        .eq("currency", "KOIN")
        .single(),
    ]);

    if (storeRes.data) setStore(storeRes.data as Store);
    if (walletRes.data) setBalance(Number(walletRes.data.balance));
  }, []);

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      load();
    }
  }, [load]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const nextClaimAt = store?.last_claim_at
    ? new Date(store.last_claim_at).getTime() + CLAIM_INTERVAL_MS
    : 0;
  const remaining = nextClaimAt - now;
  const canClaim = !!store && remaining <= 0;

  async function onClaim() {
    setBusy("claim");
    setError(null);
    setToast(null);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("claim_store_omzet");
    setBusy(null);
    if (error) {
      if (error.message.startsWith("claim_not_ready:")) {
        setError(`${labels.claimIn} ${error.message.replace("claim_not_ready:", "")}`);
        load();
      } else {
        setError(error.message);
      }
      return;
    }
    const result = data as { amount: number; streak: number; balance: number };
    setToast(`${labels.claimed} +${result.amount} ${labels.coins}`);
    setBalance(Number(result.balance));
    setStore((s) =>
      s
        ? {
            ...s,
            last_claim_at: new Date().toISOString(),
            streak_days: result.streak,
          }
        : s
    );
  }

  async function onUpgrade() {
    setBusy("upgrade");
    setError(null);
    setToast(null);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("upgrade_store");
    setBusy(null);
    if (error) {
      setError(error.message.startsWith("insufficient_coins") ? labels.insufficient : error.message);
      return;
    }
    const result = data as { level: number; cost: number; balance: number };
    setToast(`${labels.upgradeDone} Lv.${result.level} (−${result.cost})`);
    setBalance(Number(result.balance));
    setStore((s) => (s ? { ...s, level: result.level } : s));
  }

  if (!store) {
    return (
      <div className="flex items-center justify-center py-32 text-sm text-zinc-500">
        {labels.loading}
      </div>
    );
  }

  const cost = upgradeCost(store.level);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black tracking-tight">{labels.title}</h1>

      <div className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white shadow-lg">
        <p className="text-sm font-medium opacity-90">{labels.producing}</p>
        <p className="mt-2 text-5xl font-black tabular-nums">
          {balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
        <p className="mt-1 text-sm opacity-90">{labels.coins}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={onClaim}
            disabled={!canClaim || busy !== null}
            className="rounded-full bg-white px-6 py-3 font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy === "claim" ? "…" : labels.claim}
          </button>
          <span className="rounded-full bg-white/15 px-4 py-2 text-sm tabular-nums">
            {canClaim ? "✓ ready" : `${labels.claimIn} ${fmtCountdown(remaining)}`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[
          { label: labels.level, value: `Lv.${store.level}` },
          { label: labels.streak, value: `${store.streak_days} 🔥` },
          { label: labels.league, value: store.league },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-black capitalize">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <p className="font-bold">
            {labels.upgrade} → Lv.{Math.min(store.level + 1, 10)}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            {labels.cost}: {cost.toLocaleString()} {labels.coins}
          </p>
        </div>
        <button
          onClick={onUpgrade}
          disabled={store.level >= 10 || balance < cost || busy !== null}
          className="rounded-full bg-zinc-900 px-6 py-2.5 font-semibold text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          {busy === "upgrade" ? "…" : labels.upgrade}
        </button>
      </div>

      {toast && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {toast}
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {labels.error}: {error}
        </div>
      )}
    </div>
  );
}
