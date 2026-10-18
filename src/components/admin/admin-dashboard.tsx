"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Icon, { type IconName } from "@/components/ui/icon";

type Metrics = {
  users: number;
  claims_today: number;
  coins_today: number;
  open_flags: number;
};

type AdminUser = {
  id: string;
  username: string;
  display_name: string | null;
  email: string | null;
  country: string | null;
  rank: string;
  package_tier: string | null;
  coins: number;
  open_flags: number;
  created_at: string;
};

type RecentClaim = {
  id: string;
  user_id: string;
  username: string;
  amount: number;
  created_at: string;
};

type ReviewFlag = {
  id: string;
  user_id: string;
  username: string;
  reason: string;
  created_at: string;
};

type FeatureFlag = {
  key: string;
  enabled: boolean;
  description: string;
  updated_at: string;
};

type Overview = {
  metrics: Metrics;
  recent_users: AdminUser[];
  recent_claims: RecentClaim[];
  open_review_flags: ReviewFlag[];
  feature_flags: FeatureFlag[];
};

type Labels = {
  title: string;
  subtitle: string;
  loading: string;
  denied: string;
  error: string;
  retry: string;
  usersMetric: string;
  claimsMetric: string;
  coinsMetric: string;
  flagsMetric: string;
  recentUsers: string;
  recentClaims: string;
  openFlags: string;
  featureFlags: string;
  flagUser: string;
  flagReason: string;
  reasonPlaceholder: string;
  submitFlag: string;
  resolve: string;
  cancel: string;
  noUsers: string;
  noClaims: string;
  noFlags: string;
  email: string;
  country: string;
  rank: string;
  balance: string;
  openCount: string;
  enabled: string;
  paused: string;
  flagSuccess: string;
  resolveSuccess: string;
  featureSuccess: string;
  flagNotice: string;
  featureNote: string;
  featureDailyMissions: string;
  featureStoreClaims: string;
  featureStoreUpgrades: string;
  featureDailyMissionsDescription: string;
  featureStoreClaimsDescription: string;
  featureStoreUpgradesDescription: string;
};

export default function AdminDashboard({
  labels,
  locale,
}: {
  labels: Labels;
  locale: string;
}) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [flagTarget, setFlagTarget] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("admin_get_overview");
      if (rpcError) {
        setAccessDenied(rpcError.message.includes("admin_only"));
        setError(rpcError.message.includes("admin_only") ? labels.denied : labels.error);
        return;
      }
      setAccessDenied(false);
      setError(null);
      setOverview(data as Overview);
    } catch {
      setError(labels.error);
    } finally {
      setLoading(false);
    }
  }, [labels.denied, labels.error]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function toggleFeature(flag: FeatureFlag) {
    setBusy(`feature:${flag.key}`);
    setError(null);
    try {
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc("admin_set_feature_flag", {
        p_key: flag.key,
        p_enabled: !flag.enabled,
      });
      if (rpcError) {
        setError(rpcError.message.includes("admin_only") ? labels.denied : labels.error);
        return;
      }
      setToast(labels.featureSuccess);
      await load();
      window.setTimeout(() => setToast(null), 3000);
    } catch {
      setError(labels.error);
    } finally {
      setBusy(null);
    }
  }

  async function submitFlag(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!flagTarget) return;
    setBusy("flag-user");
    setError(null);
    try {
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc("admin_flag_user", {
        p_user_id: flagTarget,
        p_reason: reason.trim(),
      });
      if (rpcError) {
        setError(rpcError.message.includes("admin_only") ? labels.denied : labels.error);
        return;
      }
      setFlagTarget(null);
      setReason("");
      setToast(labels.flagSuccess);
      await load();
      window.setTimeout(() => setToast(null), 3000);
    } catch {
      setError(labels.error);
    } finally {
      setBusy(null);
    }
  }

  async function resolveFlag(flagId: string) {
    setBusy(`resolve:${flagId}`);
    setError(null);
    try {
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc("admin_resolve_user_flag", {
        p_flag_id: flagId,
      });
      if (rpcError) {
        setError(rpcError.message.includes("admin_only") ? labels.denied : labels.error);
        return;
      }
      setToast(labels.resolveSuccess);
      await load();
      window.setTimeout(() => setToast(null), 3000);
    } catch {
      setError(labels.error);
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-32 text-sm text-zinc-500">{labels.loading}</div>;
  }

  if (accessDenied || !overview) {
    return (
      <section className="card-app mx-auto max-w-xl p-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"><Icon name="lock" size={23} /></span>
        <h1 className="mt-3 text-xl font-black">{labels.title}</h1>
        <p role="alert" className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{error ?? labels.denied}</p>
        {!accessDenied && (
          <button type="button" onClick={() => { setLoading(true); void load(); }} className="mt-5 min-h-11 rounded-xl bg-zinc-900 px-5 text-sm font-bold text-white dark:bg-emerald-600">
            {labels.retry}
          </button>
        )}
      </section>
    );
  }

  const metricCards: { label: string; value: string; icon: IconName }[] = [
    { label: labels.usersMetric, value: Number(overview.metrics.users).toLocaleString(locale), icon: "users" },
    { label: labels.claimsMetric, value: Number(overview.metrics.claims_today).toLocaleString(locale), icon: "store" },
    { label: labels.coinsMetric, value: Number(overview.metrics.coins_today).toLocaleString(locale), icon: "coins" },
    { label: labels.flagsMetric, value: Number(overview.metrics.open_flags).toLocaleString(locale), icon: "flag" },
  ];
  const localizedFeatures: Record<string, { title: string; description: string }> = {
    daily_missions: { title: labels.featureDailyMissions, description: labels.featureDailyMissionsDescription },
    store_claims: { title: labels.featureStoreClaims, description: labels.featureStoreClaimsDescription },
    store_upgrades: { title: labels.featureStoreUpgrades, description: labels.featureStoreUpgradesDescription },
  };

  return (
    <div className="space-y-5 pb-2">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-black tracking-tight">{labels.title}</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{labels.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => { setLoading(true); void load(); }}
          aria-label={labels.retry}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 text-lg hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          <Icon name="refresh" size={20} />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {metricCards.map((metric) => (
          <article key={metric.label} className="card-app min-h-28 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{metric.label}</p>
              <Icon name={metric.icon} size={21} className="text-emerald-700 dark:text-emerald-300" />
            </div>
            <p className="mt-3 text-2xl font-black tabular-nums">{metric.value}</p>
          </article>
        ))}
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
      {toast && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{toast}</p>}

      <section className="card-app p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-black">{labels.featureFlags}</h2>
          <Icon name="settings" size={20} className="text-zinc-500" />
        </div>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{labels.featureNote}</p>
        <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800">
          {overview.feature_flags.map((flag) => (
            <div key={flag.key} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="font-bold">{localizedFeatures[flag.key]?.title ?? flag.key.replaceAll("_", " ")}</p>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{localizedFeatures[flag.key]?.description ?? flag.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={flag.enabled}
                aria-label={`${flag.key}: ${flag.enabled ? labels.enabled : labels.paused}`}
                disabled={busy !== null}
                onClick={() => void toggleFeature(flag)}
                className={`min-h-11 min-w-24 rounded-full px-4 text-xs font-black transition disabled:opacity-60 ${flag.enabled ? "bg-emerald-600 text-white" : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}`}
              >
                {busy === `feature:${flag.key}` ? "…" : flag.enabled ? labels.enabled : labels.paused}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-black">{labels.recentUsers}</h2>
          <span className="text-xs font-bold text-zinc-500">{overview.recent_users.length}</span>
        </div>
        {overview.recent_users.length === 0 ? (
          <div className="card-app p-5 text-sm text-zinc-500">{labels.noUsers}</div>
        ) : (
          <div className="space-y-3">
            {overview.recent_users.map((user) => (
              <article key={user.id} className="card-app p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-black">{user.display_name || user.username}</p>
                    <p className="mt-0.5 truncate text-xs text-zinc-500">{user.email || user.id}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-bold capitalize dark:bg-zinc-800">{user.rank}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">{labels.balance}: {Number(user.coins).toLocaleString(locale)}</span>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-semibold dark:bg-zinc-800">{labels.country}: {user.country ?? "—"}</span>
                  {Number(user.open_flags) > 0 && <span className="rounded-full bg-amber-50 px-2.5 py-1 font-bold text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">{labels.openCount}: {user.open_flags}</span>}
                </div>
                <button
                  type="button"
                  onClick={() => { setFlagTarget(flagTarget === user.id ? null : user.id); setReason(""); }}
                  className="mt-3 min-h-10 rounded-xl border border-zinc-200 px-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  {labels.flagUser}
                </button>
                {flagTarget === user.id && (
                  <form onSubmit={submitFlag} className="mt-3 space-y-2">
                    <label htmlFor={`reason-${user.id}`} className="block text-xs font-bold">{labels.flagReason}</label>
                    <textarea
                      id={`reason-${user.id}`}
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      minLength={5}
                      maxLength={500}
                      required
                      placeholder={labels.reasonPlaceholder}
                      className="min-h-24 w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950"
                    />
                    <div className="flex gap-2">
                      <button type="submit" disabled={busy !== null} className="min-h-10 rounded-xl bg-amber-600 px-3 text-xs font-black text-white disabled:opacity-50">
                        {busy === "flag-user" ? "…" : labels.submitFlag}
                      </button>
                      <button type="button" onClick={() => setFlagTarget(null)} className="min-h-10 rounded-xl px-3 text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        {labels.cancel}
                      </button>
                    </div>
                  </form>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-black">{labels.openFlags}</h2>
        <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">{labels.flagNotice}</p>
        {overview.open_review_flags.length === 0 ? (
          <div className="card-app p-5 text-sm text-zinc-500">{labels.noFlags}</div>
        ) : (
          <div className="space-y-3">
            {overview.open_review_flags.map((flag) => (
              <article key={flag.id} className="card-app p-4">
                <p className="font-black">{flag.username}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{flag.reason}</p>
                <button
                  type="button"
                  onClick={() => void resolveFlag(flag.id)}
                  disabled={busy !== null}
                  className="mt-3 min-h-10 rounded-xl border border-zinc-200 px-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  {busy === `resolve:${flag.id}` ? "…" : labels.resolve}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-black">{labels.recentClaims}</h2>
        {overview.recent_claims.length === 0 ? (
          <div className="card-app p-5 text-sm text-zinc-500">{labels.noClaims}</div>
        ) : (
          <div className="card-app divide-y divide-zinc-100 overflow-hidden dark:divide-zinc-800">
            {overview.recent_claims.map((claim) => (
              <div key={claim.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{claim.username}</p>
                  <p className="mt-1 text-xs text-zinc-500">{new Date(claim.created_at).toLocaleString(locale)}</p>
                </div>
                <p className="shrink-0 font-black text-emerald-600">+{Number(claim.amount).toLocaleString(locale)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
