"use client";

import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
        onClick={logout}
        aria-label={label || (locale === "id" ? "Keluar" : "Log out")}
        className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-900"
      >
        🚪
      </button>
    );
  }

  return (
    <button
      onClick={logout}
      className="flex items-center gap-2.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
    >
      <span>🚪</span>
      {label}
    </button>
  );
}
