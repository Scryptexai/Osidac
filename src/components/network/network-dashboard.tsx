"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Labels = {
  title: string;
  branches: string;
  commission: string;
  rank: string;
  invite: string;
  copy: string;
  copied: string;
  loading: string;
  level: string;
  total: string;
  direct: string;
  shareNote: string;
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
    (async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const [profileRes, closureRes] = await Promise.all([
        supabase.from("profiles").select("referral_code, rank").eq("id", uid).single(),
        supabase.from("referral_closure").select("depth").eq("ancestor_id", uid),
      ]);
      if (profileRes.data) {
        setRefCode(profileRes.data.referral_code);
        setRank(profileRes.data.rank);
      }
      const c = [0, 0, 0];
      (closureRes.data ?? []).forEach((row) => { const d = Number(row.depth); if (d >= 1 && d <= 3) c[d - 1] += 1; });
      setCounts(c);
      setLoading(false);
    })();
  }, []);

  const inviteUrl = typeof window !== "undefined" ? `${window.location.origin}/${locale}/register?ref=${refCode}` : "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  if (loading) return <div className="flex items-center justify-center py-32 text-sm text-zinc-500">{labels.loading}</div>;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-black tracking-tight">{labels.title}</h1>

      {/* Rank hero */}
      <div className="rounded-[2rem] bg-gradient-to-br from-violet-600 to-indigo-600 p-6 text-white shadow-xl shadow-violet-500/20">
        <p className="text-sm font-semibold opacity-80">{labels.rank}</p>
        <p className="mt-1 text-3xl font-black capitalize">{rank}</p>
        <div className="mt-4 flex gap-2">
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur">🌐 {counts.reduce((a, b) => a + b, 0)} {labels.total}</span>
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur">👥 {counts[0]} {labels.direct}</span>
        </div>
      </div>

      {/* L1 L2 L3 */}
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card-app p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">{labels.level} {i + 1}</p>
            <p className="mt-1 text-3xl font-black">{counts[i]}</p>
            <p className="mt-1 text-[11px] font-bold text-emerald-600">{[ "8%", "3%", "1%"][i]}</p>
          </div>
        ))}
      </div>

      {/* Invite card */}
      <div className="card-app p-5">
        <p className="flex items-center gap-2 text-sm font-black">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-sm dark:bg-emerald-900/40">🔗</span>
          {labels.invite}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <code className="flex-1 truncate rounded-2xl bg-zinc-100 px-4 py-3 text-sm dark:bg-zinc-800">{inviteUrl || "…"}</code>
          <button onClick={copy} className="shrink-0 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-600">
            {copied ? `✓ ${labels.copied}` : labels.copy}
          </button>
        </div>
        <p className="mt-3 text-xs text-zinc-500">{labels.shareNote}</p>
      </div>
    </div>
  );
}
