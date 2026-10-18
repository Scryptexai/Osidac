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
      (closureRes.data ?? []).forEach((row) => {
        const d = Number(row.depth);
        if (d >= 1 && d <= 3) c[d - 1] += 1;
      });
      setCounts(c);
      setLoading(false);
    })();
  }, []);

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/register?ref=${refCode}`
      : "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

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

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: labels.branches, value: String(counts[0]) },
          { label: `${labels.level} 2`, value: String(counts[1]) },
          { label: `${labels.level} 3`, value: String(counts[2]) },
          { label: labels.rank, value: rank },
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

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-semibold text-zinc-500">{labels.invite}</p>
        <div className="mt-2 flex items-center gap-2">
          <code className="flex-1 truncate rounded-xl bg-zinc-100 px-4 py-2.5 text-sm dark:bg-zinc-800">
            {inviteUrl}
          </code>
          <button
            onClick={copy}
            className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            {copied ? labels.copied : labels.copy}
          </button>
        </div>
      </div>
    </div>
  );
}
