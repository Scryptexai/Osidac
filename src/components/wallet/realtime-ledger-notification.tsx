"use client";

import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import Icon from "@/components/ui/icon";

type Labels = {
  credit: string;
  debit: string;
  dismiss: string;
};

type LedgerInsert = {
  amount: number | string;
  currency: string;
};

export default function RealtimeLedgerNotification({ labels }: { labels: Labels }) {
  const [message, setMessage] = useState<string | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel | null = null;
    let disposed = false;

    async function subscribeToOwnLedger() {
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;
      if (!userId || disposed) return;

      channel = supabase
        .channel(`member-ledger:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "ledger_entries",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const entry = payload.new as LedgerInsert;
            const amount = Number(entry.amount);
            if (!Number.isFinite(amount)) return;

            const label = amount >= 0 ? labels.credit : labels.debit;
            const sign = amount > 0 ? "+" : "";
            setMessage(`${label}: ${sign}${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${entry.currency}`);
            if (timeout.current) clearTimeout(timeout.current);
            timeout.current = setTimeout(() => setMessage(null), 5000);
          },
        )
        .subscribe();
    }

    void subscribeToOwnLedger();

    return () => {
      disposed = true;
      if (channel) void supabase.removeChannel(channel);
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [labels.credit, labels.debit]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 top-16 z-50 mx-auto max-w-md rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-xl shadow-emerald-950/10 dark:border-emerald-900 dark:bg-zinc-900"
    >
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          <Icon name="coins" size={19} />
        </span>
        <p className="min-w-0 flex-1 text-sm font-bold text-zinc-800 dark:text-zinc-100">{message}</p>
        <button
          type="button"
          aria-label={labels.dismiss}
          onClick={() => setMessage(null)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Icon name="close" size={17} />
        </button>
      </div>
    </div>
  );
}
