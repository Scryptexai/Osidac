"use client";

import { useEffect, useRef, useState } from "react";
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
};

export default function NetworkDashboard({ labels }: { labels: Labels }) {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";
  const [counts, setCounts] = useState<number[]>([0, 0, 0]);
  const [refCode, setRefCode] = useState("");
  const [rank, setRank] = useState("starter");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    void (async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) {
        setLoading(false);
        return;
      }
      const [profileRes, closureRes] = await Promise.all([
        supabase.from("profiles").select("referral_code, rank").eq("id", uid).single(),
        supabase.from("referral_closure").select("depth").eq("ancestor_id", uid),
      ]);
      if (profileRes.data) {
        setRefCode(profileRes.data.referral_code);
        setRank(profileRes.data.rank);
      }
      const nextCounts = [0, 0, 0];
      (closureRes.data ?? []).forEach((row) => {
        const depth = Number(row.depth);
        if (depth >= 1 && depth <= 3) nextCounts[depth - 1] += 1;
      });
      setCounts(nextCounts);
      setLoading(false);
    })();
  }, []);

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

  if (loading) return <div role="status" className="flex min-h-44 items-center justify-center text-sm text-zinc-500">{labels.loading}</div>;

  return (
    <div className="space-y-5 pb-2">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">OSIDAC</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight">{labels.title}</h1>
      </header>

      <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-violet-700 to-indigo-700 p-5 text-white shadow-xl shadow-violet-700/15 sm:p-6">
        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full border-[24px] border-white/10" />
        <div className="relative">
          <p className="text-sm font-semibold text-white/75">{labels.rank}</p>
          <p className="mt-1 text-3xl font-black capitalize">{rank}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-xs font-bold backdrop-blur">
              <Icon name="network" size={16} />
              {counts.reduce((sum, count) => sum + count, 0).toLocaleString(locale)} {labels.total}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-xs font-bold backdrop-blur">
              <Icon name="users" size={16} />
              {counts[0].toLocaleString(locale)} {labels.direct}
            </span>
          </div>
        </div>
      </section>

      <section aria-label={labels.branches} className="grid grid-cols-3 gap-3">
        {counts.map((count, index) => (
          <article key={index} className="card-app flex min-h-28 flex-col items-center justify-center p-3 text-center sm:p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500 sm:text-xs">{labels.level} {index + 1}</p>
            <p className="mt-1 text-3xl font-black tabular-nums text-zinc-950 dark:text-white">{count.toLocaleString(locale)}</p>
            <p className="mt-1 text-[10px] font-semibold text-zinc-500 sm:text-xs">{index === 0 ? labels.direct : labels.branches}</p>
          </article>
        ))}
      </section>

      <p className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm leading-relaxed text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-100">
        <Icon name="info" size={18} className="mt-0.5 shrink-0" />
        {labels.commissionNote}
      </p>

      <section className="card-app p-5 sm:p-6">
        <p className="flex items-center gap-2 text-sm font-black">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <Icon name="link" size={19} />
          </span>
          {labels.invite}
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <code className="min-h-12 min-w-0 flex-1 truncate rounded-xl bg-zinc-100 px-4 py-3 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 sm:text-sm">
            {inviteUrl || "—"}
          </code>
          <button
            type="button"
            onClick={() => void copyInvite()}
            disabled={!inviteUrl}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? <Icon name="check" size={17} /> : <Icon name="share" size={17} />}
            {copied ? labels.copied : labels.copy}
          </button>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{labels.shareNote}</p>
      </section>
    </div>
  );
}
