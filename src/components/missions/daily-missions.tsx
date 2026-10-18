"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Icon, { type IconName } from "@/components/ui/icon";

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
  retry: string;
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
  icon: IconName;
  title: string;
  description: string;
  reward?: string;
  action?: React.ReactNode;
  done: boolean;
  doneLabel: string;
}) {
  return (
    <article className="card-app flex min-h-48 flex-col p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e9e5d8] text-[#171d19] dark:bg-[#252a22] dark:text-[#d6f36a]">
            <Icon name={icon} size={21} />
          </span>
          <div className="min-w-0">
            <h3 className="font-black leading-tight">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{description}</p>
          </div>
        </div>
        {done && <span aria-label={doneLabel} className="text-emerald-600 dark:text-emerald-300"><Icon name="circleCheck" size={21} /></span>}
      </div>
      {reward && <p className="market-kicker mt-3 text-[#616b2d] dark:text-[#d6f36a]">{reward}</p>}
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
      setError(null);
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
    setToast(null);
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
    return <div role="status" className="flex min-h-36 items-center justify-center text-sm text-zinc-500">{labels.loading}</div>;
  }

  if (!status) {
    return (
      <div className="card-app p-5 text-center">
        <p role="alert" className="text-sm text-red-600 dark:text-red-300">{error ?? labels.error}</p>
        <button
          type="button"
          onClick={() => { setError(null); setLoading(true); void load(); }}
          className="mt-4 min-h-11 rounded-xl bg-zinc-900 px-5 text-sm font-bold text-white dark:bg-emerald-600"
        >
          {labels.retry}
        </button>
      </div>
    );
  }

  const progress = Number(status.check_in_claimed) + Number(status.store_claimed) + Number(status.invite_claimed);

  return (
    <section aria-labelledby="daily-missions-title" className="space-y-4">
      <div className="market-ink-panel rounded-[1.35rem] border border-[#171d19]/20 p-5 text-white sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="daily-missions-title" className="text-xl font-black tracking-tight">{labels.dailyTitle}</h2>
            <p className="mt-1 text-sm leading-relaxed text-emerald-50/90">{labels.dailySubtitle}</p>
          </div>
          <span className="market-kicker shrink-0 rounded-lg bg-[#d6f36a] px-3 py-2 text-[#171d19]">{progress}/3</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-[#d6f36a] transition-all" style={{ width: `${(progress / 3) * 100}%` }} />
        </div>
        <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-white/60">
          <Icon name="clock" size={14} />
          {labels.progress} · {labels.reset}
        </p>
        <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs leading-relaxed text-white/65">{labels.rewardNote}</p>
      </div>

      {!status.enabled && (
        <p role="status" className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          {labels.disabled}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <MissionCard
          icon="gift"
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
              className="market-lime-button min-h-11 w-full rounded-xl px-4 text-sm font-black"
            >
              {busy === "check_in" ? "…" : status.check_in_claimed ? labels.claimed : labels.claimButton}
            </button>
          )}
        />

        <MissionCard
          icon="store"
          title={labels.storeTitle}
          description={labels.storeDescription}
          done={status.store_claimed}
          doneLabel={labels.completed}
          action={(
            <Link
              href={`/${locale}/app`}
              className="flex min-h-11 items-center justify-center rounded-xl border border-[#171d19]/15 px-4 text-sm font-black text-[#171d19] transition hover:bg-[#f1eee3]"
            >
              {status.store_claimed ? labels.completed : labels.storeButton}
            </Link>
          )}
        />

        <MissionCard
          icon="users"
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
              className="market-lime-button min-h-11 w-full rounded-xl px-4 text-sm font-black"
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
          icon="share"
          title={labels.shareTitle}
          description={labels.shareDescription}
          done={false}
          doneLabel={labels.completed}
          action={(
            <button
              type="button"
              onClick={() => void shareInvite()}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#171d19]/15 px-4 text-sm font-black text-[#171d19] transition hover:bg-[#f1eee3]"
            >
              <Icon name="share" size={17} />
              {labels.shareButton}
            </button>
          )}
        />
      </div>

      {(error || toast) && (
        <p
          role={error ? "alert" : "status"}
          className={`rounded-xl px-4 py-3 text-sm font-semibold ${error
            ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"}`}
        >
          {error ?? toast}
        </p>
      )}
    </section>
  );
}
