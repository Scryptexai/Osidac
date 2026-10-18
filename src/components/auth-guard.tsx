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
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (data.user) {
          setState("ok");
        } else {
          setState("redirect");
          router.replace(`/${params?.locale ?? "en"}/login`);
        }
      })
      .catch(() => {
        setState("redirect");
        router.replace(`/${params?.locale ?? "en"}/login`);
      });
  }, [params, router]);

  if (state !== "ok") {
    return (
      <div className="flex items-center justify-center py-32 text-sm text-zinc-500">
        {loadingLabel}
      </div>
    );
  }

  return <>{children}</>;
}
