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
  ready: string;
  boost: string;
  maxLevel: string;
  max: string;
  upgradeButton: string;
  paused: string;
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

function leagueEmoji(league: string) {
  const m: Record<string, string> = { bronze: "🥉", silver: "🥈", gold: "🥇", platinum: "💎", diamond: "👑" };
  return m[league] ?? "🏪";
}

export default function StoreDashboard({ labels }: { labels: Labels }) {
  const [store, setStore] = useState<Store | null>(null);
  const [balance, setBalance] = useState(0);
  const [now, setNow] = useState(0);
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
      supabase.from("virtual_stores").select("level, speed_multiplier, streak_days, league, last_claim_at").eq("user_id", uid).single(),
      supabase.from("wallets").select("balance").eq("user_id", uid).eq("currency", "KOIN").single(),
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

  const nextClaimAt = store?.last_claim_at ? new Date(store.last_claim_at).getTime() + CLAIM_INTERVAL_MS : 0;
  const remaining = nextClaimAt - now;
  const canClaim = !!store && remaining <= 0;
  const progress = store?.last_claim_at ? Math.max(0, Math.min(1, 1 - remaining / CLAIM_INTERVAL_MS)) : 1;

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
      } else setError(error.message.includes("feature_disabled") ? labels.paused : error.message);
      return;
    }
    const result = data as { amount: number; streak: number; balance: number };
    setToast(`${labels.claimed} +${result.amount} ${labels.coins}`);
    setBalance(Number(result.balance));
    setStore((s) => (s ? { ...s, last_claim_at: new Date().toISOString(), streak_days: result.streak } : s));
    setTimeout(() => setToast(null), 3500);
  }

  async function onUpgrade() {
    setBusy("upgrade");
    setError(null);
    setToast(null);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("upgrade_store");
    setBusy(null);
    if (error) {
      setError(
        error.message.startsWith("insufficient_coins")
          ? labels.insufficient
          : error.message.includes("feature_disabled")
            ? labels.paused
            : error.message
      );
      return;
    }
    const result = data as { level: number; cost: number; balance: number };
    setToast(`${labels.upgradeDone} Lv.${result.level} (−${result.cost})`);
    setBalance(Number(result.balance));
    setStore((s) => (s ? { ...s, level: result.level } : s));
    setTimeout(() => setToast(null), 3500);
  }

  if (!store) {
    return <div className="flex items-center justify-center py-32 text-sm text-zinc-500">{labels.loading}</div>;
  }

  const cost = upgradeCost(store.level);

  return (
    <div className="space-y-5 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tight">{labels.title}</h1>
        <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
          {labels.level} {store.level}
        </span>
      </div>

      {/* Balance hero card — app style */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500 via-emerald-500 to-teal-600 p-6 text-white shadow-xl shadow-emerald-500/20">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <p className="text-sm font-semibold opacity-90">{labels.producing}</p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-4xl font-black tabular-nums tracking-tight">
            {balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
          <span className="text-sm font-bold opacity-80">{labels.coins}</span>
        </p>

        {/* Progress bar */}
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-1000"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-semibold opacity-80">
          {canClaim ? `✓ ${labels.ready}` : `${labels.claimIn} ${fmtCountdown(remaining)}`}
        </p>

        {/* Claim button — big thumb-friendly */}
        <button
          onClick={onClaim}
          disabled={!canClaim || busy !== null}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-lg font-black text-emerald-700 shadow-lg transition active:scale-[0.98] hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>💰</span> {busy === "claim" ? "…" : labels.claim}
        </button>
      </div>

      {/* Stats row — scroll on mobile */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-app p-4 text-center">
          <p className="text-lg">🔥</p>
          <p className="mt-1 text-xl font-black">{store.streak_days}</p>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{labels.streak}</p>
        </div>
        <div className="card-app p-4 text-center">
          <p className="text-lg">{leagueEmoji(store.league)}</p>
          <p className="mt-1 text-sm font-black capitalize">{store.league}</p>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{labels.league}</p>
        </div>
        <div className="card-app p-4 text-center">
          <p className="text-lg">⚡</p>
          <p className="mt-1 text-sm font-black">{store.speed_multiplier}×</p>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{labels.boost}</p>
        </div>
      </div>

      {/* Upgrade card */}
      <div className="card-app p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 font-black">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-sm text-white dark:bg-white dark:text-zinc-900">
                ⬆
              </span>
              {labels.upgrade} → Lv.{Math.min(store.level + 1, 10)}
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              {labels.cost}: <span className="font-bold text-zinc-900 dark:text-zinc-100">{cost.toLocaleString()} {labels.coins}</span>
            </p>
            {store.level >= 10 && <p className="mt-1 text-xs font-bold text-emerald-600">{labels.maxLevel}</p>}
          </div>
          <button
            onClick={onUpgrade}
            disabled={store.level >= 10 || balance < cost || busy !== null}
            className="shrink-0 rounded-full bg-zinc-900 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            {busy === "upgrade" ? "…" : store.level >= 10 ? labels.max : labels.upgradeButton}
          </button>
        </div>
        {/* Level dots */}
        <div className="mt-4 flex gap-1.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${i < store.level ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-800"}`}
            />
          ))}
        </div>
      </div>

      {toast && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {toast}
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {labels.error}: {error}
        </div>
      )}
    </div>
  );
}
