"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthGuard({
  children,
  loadingLabel = "Loading…",
}: {
  children: React.ReactNode;
  loadingLabel?: string;
}) {
  const [state, setState] = useState<"loading" | "ok" | "redirect">("loading");
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function verifySession() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();
        if (!active) return;
        if (error || !data.user) {
          setState("redirect");
          router.replace(`/${locale}/login`);
          return;
        }
        setState("ok");
      } catch {
        if (!active) return;
        setState("redirect");
        router.replace(`/${locale}/login`);
      }
    }

    void verifySession();
    return () => { active = false; };
  }, [locale, router]);

  if (state !== "ok") {
    return (
      <div role="status" className="flex items-center justify-center py-32 text-sm text-zinc-500">
        {loadingLabel}
      </div>
    );
  }

  return <>{children}</>;
}
