"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type MissionStatus = {
  mission_day: string;
  enabled: boolean;
  check_in_claimed: boolean;
  invite_claimed: boolean;
  invite_available: boolean;
  store_claimed: boolean;
  balance: number;
};

type MissionKey = "check_in" | "invite_friend";

type Labels = {
  dailyTitle: string;
  dailySubtitle: string;
  rewardNote: string;
  progress: string;
  reset: string;
  checkInTitle: string;
  checkInDescription: string;
  checkInReward: string;
  inviteTitle: string;
  inviteDescription: string;
  inviteReward: string;
  shareTitle: string;
  shareDescription: string;
  shareButton: string;
  shareSuccess: string;
  shareError: string;
  linkMissing: string;
  storeTitle: string;
  storeDescription: string;
  storeButton: string;
  claimButton: string;
  claimed: string;
  completed: string;
  notReady: string;
  loading: string;
  error: string;
  disabled: string;
  coins: string;
};

function MissionCard({
  icon,
  title,
  description,
  reward,
  action,
  done,
  doneLabel,
}: {
  icon: string;
  title: string;
  description: string;
  reward?: string;
  action?: React.ReactNode;
  done: boolean;
  doneLabel: string;
}) {
  return (
    <article className="card-app flex min-h-48 flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-xl dark:bg-emerald-950/50">
            {icon}
          </span>
          <div>
            <h3 className="font-black leading-tight">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{description}</p>
          </div>
        </div>
        {done && <span aria-label={doneLabel} className="text-lg text-emerald-600">✓</span>}
      </div>
      {reward && <p className="mt-3 text-sm font-black text-emerald-700 dark:text-emerald-300">{reward}</p>}
      {action && <div className="mt-auto pt-4">{action}</div>}
    </article>
  );
}

export default function DailyMissions({
  locale,
  labels,
}: {
  locale: string;
  labels: Labels;
}) {
  const [status, setStatus] = useState<MissionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<MissionKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("get_daily_mission_status");
      if (rpcError) {
        setError(labels.error);
        return;
      }
      setStatus(data as MissionStatus);
    } catch {
      setError(labels.error);
    } finally {
      setLoading(false);
    }
  }, [labels.error]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function claim(missionKey: MissionKey) {
    setBusy(missionKey);
    setError(null);
    setToast(null);
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("claim_daily_mission", {
        p_mission_key: missionKey,
      });
      if (rpcError) {
        const message = rpcError.message.includes("feature_disabled")
          ? labels.disabled
          : rpcError.message.includes("mission_not_ready")
            ? labels.notReady
            : rpcError.message.includes("mission_already_claimed")
              ? labels.claimed
              : labels.error;
        await load();
        setError(message);
        return;
      }
      const result = data as { reward: number };
      setToast(`+${Number(result.reward).toLocaleString()} ${labels.coins}`);
      await load();
      window.setTimeout(() => setToast(null), 3500);
    } catch {
      setError(labels.error);
    } finally {
      setBusy(null);
    }
  }

  async function shareInvite() {
    setError(null);
    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        setError(labels.linkMissing);
        return;
      }
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", authData.user.id)
        .single();
      if (profileError || !profile?.referral_code) {
        setError(labels.shareError);
        return;
      }

      const invite = new URL(`/${locale}/register`, window.location.origin);
      invite.searchParams.set("ref", profile.referral_code);
      const url = invite.toString();
      if (navigator.share) {
        await navigator.share({ title: "OSIDAC", text: labels.shareDescription, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setToast(labels.shareSuccess);
      window.setTimeout(() => setToast(null), 3500);
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") return;
      setError(labels.shareError);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-16 text-sm text-zinc-500">{labels.loading}</div>;
  }

  if (!status) {
    return (
      <div className="card-app p-5 text-center">
        <p role="alert" className="text-sm text-red-600">{error ?? labels.error}</p>
        <button type="button" onClick={() => { setError(null); void load(); }} className="mt-4 min-h-11 rounded-xl bg-zinc-900 px-5 text-sm font-bold text-white dark:bg-emerald-600">
          {labels.claimButton}
        </button>
      </div>
    );
  }

  const progress = Number(status.check_in_claimed) + Number(status.store_claimed) + Number(status.invite_claimed);

  return (
    <section aria-labelledby="daily-missions-title" className="space-y-4">
      <div className="rounded-[1.75rem] bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white shadow-lg shadow-emerald-700/15">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="daily-missions-title" className="text-xl font-black tracking-tight">{labels.dailyTitle}</h2>
            <p className="mt-1 text-sm text-emerald-50/90">{labels.dailySubtitle}</p>
          </div>
          <span className="shrink-0 rounded-2xl bg-white/15 px-3 py-2 text-xs font-black backdrop-blur">
            {progress}/3
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white transition-all" style={{ width: `${(progress / 3) * 100}%` }} />
        </div>
        <p className="mt-3 text-xs font-semibold text-emerald-50/85">{labels.progress} · {labels.reset}</p>
        <p className="mt-3 rounded-xl bg-black/10 px-3 py-2 text-xs leading-relaxed text-emerald-50/90">{labels.rewardNote}</p>
      </div>

      {!status.enabled && (
        <p role="status" className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          {labels.disabled}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <MissionCard
          icon="🎁"
          title={labels.checkInTitle}
          description={labels.checkInDescription}
          reward={labels.checkInReward}
          done={status.check_in_claimed}
          doneLabel={labels.completed}
          action={(
            <button
              type="button"
              onClick={() => void claim("check_in")}
              disabled={!status.enabled || status.check_in_claimed || busy !== null}
              className="min-h-11 w-full rounded-xl bg-emerald-600 px-4 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-400"
            >
              {busy === "check_in" ? "…" : status.check_in_claimed ? labels.claimed : labels.claimButton}
            </button>
          )}
        />

        <MissionCard
          icon="🏪"
          title={labels.storeTitle}
          description={labels.storeDescription}
          done={status.store_claimed}
          doneLabel={labels.completed}
          action={(
            <Link
              href={`/${locale}/app`}
              className="flex min-h-11 items-center justify-center rounded-xl border border-zinc-200 px-4 text-sm font-black text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {status.store_claimed ? labels.completed : labels.storeButton}
            </Link>
          )}
        />

        <MissionCard
          icon="🌱"
          title={labels.inviteTitle}
          description={labels.inviteDescription}
          reward={labels.inviteReward}
          done={status.invite_claimed}
          doneLabel={labels.completed}
          action={(
            <button
              type="button"
              onClick={() => void claim("invite_friend")}
              disabled={!status.enabled || status.invite_claimed || !status.invite_available || busy !== null}
              className="min-h-11 w-full rounded-xl bg-emerald-600 px-4 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-400"
            >
              {busy === "invite_friend"
                ? "…"
                : status.invite_claimed
                  ? labels.claimed
                  : status.invite_available
                    ? labels.claimButton
                    : labels.notReady}
            </button>
          )}
        />

        <MissionCard
          icon="📨"
          title={labels.shareTitle}
          description={labels.shareDescription}
          done={false}
          doneLabel={labels.completed}
          action={(
            <button
              type="button"
              onClick={() => void shareInvite()}
              className="min-h-11 w-full rounded-xl border border-emerald-200 px-4 text-sm font-black text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
            >
              {labels.shareButton}
            </button>
          )}
        />
      </div>

      {(error || toast) && (
        <p
          role={error ? "alert" : "status"}
          className={`rounded-xl px-4 py-3 text-sm font-semibold ${error ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"}`}
        >
          {error ?? toast}
        </p>
      )}
    </section>
  );
}
