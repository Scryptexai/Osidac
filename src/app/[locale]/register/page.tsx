"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getClientDictionary } from "@/lib/i18n/client";

function RegisterForm() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";
  const auth = getClientDictionary(locale).auth;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referral, setReferral] = useState(() => searchParams?.get("ref")?.toUpperCase() ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

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
        data: { referral_code: referral || null, locale },
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
      setNotice(auth.confirmNotice);
    }
  }

  return (
    <div className="min-h-[75vh] bg-zinc-50 dark:bg-zinc-900/40">
      <div className="bg-gradient-to-b from-emerald-600 to-teal-600 px-5 pb-16 pt-10 text-center text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/icon-192.png" alt="" className="mx-auto h-16 w-16 rounded-2xl shadow-lg" />
        <h1 className="mt-4 text-3xl font-black">{auth.registerTitle}</h1>
        <p className="mt-1 text-emerald-50/90">{auth.registerSubtitle}</p>
      </div>

      <div className="mx-auto -mt-10 max-w-md px-5 pb-12">
        <form onSubmit={onSubmit} className="card-app space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-bold">{auth.email}</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base outline-none transition focus:border-emerald-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:focus:bg-zinc-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold">{auth.password}</label>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base outline-none transition focus:border-emerald-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:focus:bg-zinc-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold">{auth.referral}</label>
            <input
              type="text"
              autoCapitalize="characters"
              value={referral}
              onChange={(e) => setReferral(e.target.value.toUpperCase())}
              placeholder="e.g. A1B2C3D4"
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base uppercase outline-none transition focus:border-emerald-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:focus:bg-zinc-900"
            />
          </div>
          {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-500 dark:bg-red-950/40">{error}</p>}
          {notice && <p role="status" className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-600 dark:bg-emerald-950/40">{notice}</p>}
          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full rounded-2xl bg-emerald-500 py-4 text-base font-black text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600 disabled:opacity-60"
          >
            {loading ? "…" : auth.registerButton}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {auth.haveAccount}{" "}
          <Link href={`/${locale}/login`} className="font-bold text-emerald-600">
            {auth.loginButton}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const params = useParams<{ locale: string }>();
  const auth = getClientDictionary(params?.locale ?? "en").auth;
  return (
    <Suspense fallback={<div className="py-32 text-center text-sm text-zinc-500">{auth.loading}</div>}>
      <RegisterForm />
    </Suspense>
  );
}
