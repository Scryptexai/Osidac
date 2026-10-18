"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function RegisterForm() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams?.get("ref");
    if (ref) setReferral(ref.toUpperCase());
  }, [searchParams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { referral_code: referral || null },
        emailRedirectTo: `${window.location.origin}/${locale}/app`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.push(`/${locale}/app`);
      router.refresh();
    } else {
      setNotice("Check your email to confirm your account.");
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-3xl font-black tracking-tight">Open your store</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">Free to join. No package required.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold">Referral code (optional)</label>
          <input
            type="text"
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {notice && <p className="text-sm text-emerald-600">{notice}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
        >
          {loading ? "..." : "Create free account"}
        </button>
      </form>
      <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href={`/${locale}/login`} className="font-semibold text-emerald-600">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="py-32 text-center text-sm text-zinc-500">Loading…</div>}>
      <RegisterForm />
    </Suspense>
  );
}
