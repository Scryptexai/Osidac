"use client";

import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Icon from "@/components/ui/icon";

export default function LogoutButton({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => void logout()}
        aria-label={label || (locale === "id" ? "Keluar" : "Log out")}
        className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-emerald-500 dark:hover:bg-zinc-900"
      >
        <Icon name="logout" size={18} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      className="flex min-h-11 items-center gap-2.5 whitespace-nowrap rounded-xl px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
    >
      <Icon name="logout" size={18} />
      {label}
    </button>
  );
}
