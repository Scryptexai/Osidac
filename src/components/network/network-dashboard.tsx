"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Icon from "@/components/ui/icon";

type Labels = {
  title: string;
  branches: string;
  rank: string;
  invite: string;
  copy: string;
  copied: string;
  loading: string;
  level: string;
  total: string;
  direct: string;
  shareNote: string;
  commissionNote: string;
  error: string;
  retry: string;
};

export default function NetworkDashboard({ labels }: { labels: Labels }) {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";
  const [counts, setCounts] = useState<number[] | null>(null);
  const [refCode, setRefCode] = useState("");
  const [rank, setRank] = useState("starter");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user?.id) throw new Error("network_session_unavailable");
      const uid = userData.user.id;
      const [profileRes, closureRes] = await Promise.all([
        supabase.from("profiles").select("referral_code, rank").eq("id", uid).single(),
        supabase.from("referral_closure").select("depth").eq("ancestor_id", uid),
      ]);
      if (profileRes.error || !profileRes.data || closureRes.error) throw new Error("network_data_unavailable");

      const nextCounts = [0, 0, 0];
      (closureRes.data ?? []).forEach((row) => {
        const depth = Number(row.depth);
        if (depth >= 1 && depth <= 3) nextCounts[depth - 1] += 1;
      });
      setRefCode(profileRes.data.referral_code);
      setRank(profileRes.data.rank);
      setCounts(nextCounts);
    } catch {
      setCounts(null);
      setRefCode("");
      setError(labels.error);
    } finally {
      setLoading(false);
    }
  }, [labels.error]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const inviteUrl = typeof window !== "undefined" && refCode
    ? `${window.location.origin}/${locale}/register?ref=${encodeURIComponent(refCode)}`
    : "";

  async function copyInvite() {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  if (loading) return <div role="status" className="flex min-h-44 items-center justify-center text-sm text-[#716f63]">{labels.loading}</div>;

  if (error || !counts) {
    return (
      <div className="space-y-5">
        <header>
          <p className="market-kicker text-[#716f63]">OSIDAC / COMMUNITY</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em]">{labels.title}</h1>
        </header>
        <section className="market-panel p-5 text-center">
          <p role="alert" className="text-sm leading-relaxed text-[#55574e]">{error ?? labels.error}</p>
          <button type="button" onClick={() => void load()} className="market-lime-button mt-4 min-h-11 rounded-xl px-5 text-sm font-black">{labels.retry}</button>
        </section>
      </div>
    );
  }

  const totalCount = counts.reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-5 pb-2">
      <header>
        <p className="market-kicker text-[#716f63]">OSIDAC / COMMUNITY</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.05em]">{labels.title}</h1>
      </header>

      <section className="market-ink-panel relative overflow-hidden rounded-[1.35rem] border border-[#171d19]/20 p-5 text-white sm:p-6">
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full border-[24px] border-white/[0.07]" />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="market-kicker text-white/50">{labels.rank}</p>
            <p className="mt-2 text-3xl font-black capitalize tracking-tight">{rank}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="market-stamp border-white/20 text-white/75"><Icon name="network" size={15} />{totalCount.toLocaleString(locale)} {labels.total}</span>
            <span className="market-stamp border-[#d6f36a]/35 text-[#d6f36a]"><Icon name="users" size={15} />{counts[0].toLocaleString(locale)} {labels.direct}</span>
          </div>
        </div>
      </section>

      <section aria-label={labels.branches} className="grid grid-cols-3 gap-3">
        {counts.map((count, index) => (
          <article key={index} className="market-panel flex min-h-28 flex-col items-center justify-center p-3 text-center sm:p-4">
            <p className="market-kicker text-[#716f63]">{labels.level} {index + 1}</p>
            <p className="mt-2 text-3xl font-black tabular-nums">{count.toLocaleString(locale)}</p>
            <p className="mt-1 text-[10px] font-semibold text-[#716f63] sm:text-xs">{index === 0 ? labels.direct : labels.branches}</p>
          </article>
        ))}
      </section>

      <p className="flex items-start gap-3 rounded-2xl border border-[#f37959]/25 bg-[#fff4e9] px-4 py-3.5 text-sm leading-relaxed text-[#75422f]">
        <Icon name="info" size={18} className="mt-0.5 shrink-0" />
        {labels.commissionNote}
      </p>

      <section className="market-panel p-5 sm:p-6">
        <p className="flex items-center gap-2 text-sm font-black">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d6f36a] text-[#171d19]">
            <Icon name="link" size={19} />
          </span>
          {labels.invite}
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <code className="min-h-12 min-w-0 flex-1 truncate rounded-xl bg-[#f1eee3] px-4 py-3 text-xs text-[#55574e] sm:text-sm">
            {inviteUrl || "—"}
          </code>
          <button
            type="button"
            onClick={() => void copyInvite()}
            disabled={!inviteUrl}
            className="market-lime-button inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-sm font-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? <Icon name="check" size={17} /> : <Icon name="share" size={17} />}
            {copied ? labels.copied : labels.copy}
          </button>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-[#716f63]">{labels.shareNote}</p>
      </section>
    </div>
  );
}
