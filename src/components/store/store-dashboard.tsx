"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Icon, { type IconName } from "@/components/ui/icon";

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
  coinNote: string;
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

function formatCountdown(ms: number) {
  if (ms <= 0) return "00:00:00";
  const seconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const remainder = String(seconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${remainder}`;
}

function upgradeCost(level: number) {
  return Math.round(500 * Math.pow(level, 1.6) * 100) / 100;
}

function leagueTone(league: string) {
  const tones: Record<string, string> = {
    bronze: "text-amber-600 dark:text-amber-400",
    silver: "text-zinc-500 dark:text-zinc-300",
    gold: "text-yellow-600 dark:text-yellow-400",
    platinum: "text-cyan-600 dark:text-cyan-300",
    diamond: "text-violet-600 dark:text-violet-300",
  };
  return tones[league] ?? "text-emerald-600 dark:text-emerald-300";
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
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) {
        setError(labels.error);
        return;
      }
      const [storeRes, walletRes] = await Promise.all([
        supabase
          .from("virtual_stores")
          .select("level, speed_multiplier, streak_days, league, last_claim_at")
          .eq("user_id", uid)
          .single(),
        supabase.from("wallets").select("balance").eq("user_id", uid).eq("currency", "KOIN").single(),
      ]);
      if (storeRes.error || !storeRes.data) {
        setError(labels.error);
        return;
      }
      setStore(storeRes.data as Store);
      if (walletRes.data) setBalance(Number(walletRes.data.balance));
      setError(null);
    } catch {
      setError(labels.error);
    }
  }, [labels.error]);

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      void load();
    }
  }, [load]);

  useEffect(() => {
    const start = window.setTimeout(() => setNow(Date.now()), 0);
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, []);

  const nextClaimAt = store?.last_claim_at ? new Date(store.last_claim_at).getTime() + CLAIM_INTERVAL_MS : 0;
  const remaining = nextClaimAt - now;
  const canClaim = !!store && now > 0 && remaining <= 0;
  const progress = store?.last_claim_at && now > 0
    ? Math.max(0, Math.min(1, 1 - remaining / CLAIM_INTERVAL_MS))
    : 1;

  async function onClaim() {
    setBusy("claim");
    setError(null);
    setToast(null);
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("claim_store_omzet");
      if (rpcError) {
        if (rpcError.message.startsWith("claim_not_ready:")) {
          setError(labels.claimIn);
          void load();
        } else {
          setError(rpcError.message.includes("feature_disabled") ? labels.paused : labels.error);
        }
        return;
      }
      const result = data as { amount: number; streak: number; balance: number };
      setToast(`${labels.claimed} +${Number(result.amount).toLocaleString()} ${labels.coins}`);
      setBalance(Number(result.balance));
      setStore((current) => current ? {
        ...current,
        last_claim_at: new Date().toISOString(),
        streak_days: result.streak,
      } : current);
      window.setTimeout(() => setToast(null), 3500);
    } catch {
      setError(labels.error);
    } finally {
      setBusy(null);
    }
  }

  async function onUpgrade() {
    setBusy("upgrade");
    setError(null);
    setToast(null);
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("upgrade_store");
      if (rpcError) {
        setError(
          rpcError.message.startsWith("insufficient_coins")
            ? labels.insufficient
            : rpcError.message.includes("feature_disabled")
              ? labels.paused
              : labels.error,
        );
        return;
      }
      const result = data as { level: number; cost: number; balance: number };
      setToast(`${labels.upgradeDone} Lv.${result.level} (−${Number(result.cost).toLocaleString()})`);
      setBalance(Number(result.balance));
      setStore((current) => current ? { ...current, level: result.level } : current);
      window.setTimeout(() => setToast(null), 3500);
    } catch {
      setError(labels.error);
    } finally {
      setBusy(null);
    }
  }

  if (!store) {
    return (
      <div role="status" className="flex min-h-44 items-center justify-center text-sm text-zinc-500">
        {error ? <span>{error}</span> : labels.loading}
      </div>
    );
  }

  const cost = upgradeCost(store.level);
  const stats: { icon: IconName; label: string; value: string; tone?: string }[] = [
    { icon: "flame", label: labels.streak, value: store.streak_days.toLocaleString() },
    { icon: "award", label: labels.league, value: store.league, tone: leagueTone(store.league) },
    { icon: "bolt", label: labels.boost, value: `${store.speed_multiplier}×` },
  ];

  return (
    <div className="space-y-5 pb-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">OSIDAC</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight">{labels.title}</h1>
        </div>
        <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-xs font-bold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
          <Icon name="store" size={16} />
          {labels.level} {store.level}
        </span>
      </div>

      <section aria-label={labels.coins} className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 p-5 text-white shadow-xl shadow-emerald-700/15 sm:p-6">
        <div className="pointer-events-none absolute -right-8 -top-12 h-44 w-44 rounded-full border-[26px] border-white/10" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-50/90">{labels.producing}</p>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black tabular-nums tracking-tight sm:text-5xl">
                  {balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                <span className="text-sm font-bold text-emerald-50/85">{labels.coins}</span>
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
              <Icon name="coins" size={25} />
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-emerald-50/80">{labels.coinNote}</p>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-white transition-all duration-1000" style={{ width: `${progress * 100}%` }} />
          </div>
          <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-50/90">
            <Icon name={canClaim ? "circleCheck" : "clock"} size={15} />
            {canClaim ? labels.ready : `${labels.claimIn} ${formatCountdown(remaining)}`}
          </p>

          <button
            type="button"
            onClick={() => void onClaim()}
            disabled={!canClaim || busy !== null}
            className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 text-base font-black text-emerald-800 shadow-lg transition hover:bg-emerald-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55"
          >
            <Icon name="coins" size={19} />
            {busy === "claim" ? "…" : labels.claim}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <article key={stat.label} className="card-app flex min-h-28 flex-col items-center justify-center p-3 text-center sm:p-4">
            <Icon name={stat.icon} size={20} className={stat.tone ?? "text-emerald-600 dark:text-emerald-300"} />
            <p className={`mt-2 max-w-full truncate text-sm font-black capitalize ${stat.tone ?? ""}`}>{stat.value}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 sm:text-[11px]">{stat.label}</p>
          </article>
        ))}
      </div>

      <section className="card-app p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-black">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                <Icon name="arrowUp" size={19} />
              </span>
              {labels.upgrade} → Lv.{Math.min(store.level + 1, 10)}
            </p>
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              {labels.cost}: <span className="font-bold text-zinc-900 dark:text-zinc-100">{cost.toLocaleString()} {labels.coins}</span>
            </p>
            {store.level >= 10 && <p className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">{labels.maxLevel}</p>}
          </div>
          <button
            type="button"
            onClick={() => void onUpgrade()}
            disabled={store.level >= 10 || balance < cost || busy !== null}
            className="min-h-11 shrink-0 rounded-full bg-zinc-900 px-5 text-sm font-bold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400"
          >
            {busy === "upgrade" ? "…" : store.level >= 10 ? labels.max : labels.upgradeButton}
          </button>
        </div>
        <div className="mt-5 flex gap-1.5" aria-label={`${labels.level} ${store.level} of 10`}>
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className={`h-2 flex-1 rounded-full ${index < store.level ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-800"}`} />
          ))}
        </div>
      </section>

      {(toast || error) && (
        <p
          role={error ? "alert" : "status"}
          className={`rounded-xl px-4 py-3 text-sm font-semibold ${error
            ? "border border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
            : "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"}`}
        >
          {error ?? toast}
        </p>
      )}
    </div>
  );
}
