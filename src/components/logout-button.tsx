"use client";

import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton({ label }: { label: string }) {
  const params = useParams<{ locale: string }>();
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${params?.locale ?? "en"}`);
    router.refresh();
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
