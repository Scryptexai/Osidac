"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type Labels = {
  title: string;
  subtitle: string;
  install: string;
  dismiss: string;
  iosHint: string;
};

export default function PwaInstallPrompt({
  labels,
}: {
  labels: Labels;
}) {
  const pathname = usePathname();
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    const ua = navigator.userAgent;
    const isIosDevice =
      /iPad|iPhone|iPod/i.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isIosSafari =
      isIosDevice &&
      /Safari/i.test(ua) &&
      !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
    const hintTimer = window.setTimeout(() => setShowIosHint(isIosSafari), 0);

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setPromptEvent(null);
      setShowIosHint(false);
      setDismissed(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.clearTimeout(hintTimer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    setDismissed(true);
  }

  async function install() {
    if (!promptEvent) return;
    setInstalling(true);
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      setPromptEvent(null);
      if (choice.outcome === "accepted") dismiss();
    } catch {
      setPromptEvent(null);
    } finally {
      setInstalling(false);
    }
  }

  if (dismissed || (!promptEvent && !showIosHint)) return null;

  const onAppRoute = pathname?.split("/")[2] === "app";

  return (
    <aside
      aria-label={labels.title}
      className={`fixed inset-x-3 z-50 mx-auto max-w-md rounded-2xl border border-emerald-200 bg-white p-4 shadow-xl shadow-emerald-950/10 dark:border-emerald-900 dark:bg-zinc-900 ${
        onAppRoute ? "bottom-24 md:bottom-6" : "bottom-4"
      }`}
    >
      <div className="flex items-start gap-3 pr-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/icon-192.png" alt="" className="h-11 w-11 shrink-0 rounded-xl" />
        <div className="min-w-0">
          <p className="font-black tracking-tight">{labels.title}</p>
          <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
            {labels.subtitle}
          </p>
          {showIosHint && !promptEvent && (
            <p className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {labels.iosHint}
            </p>
          )}
          {promptEvent && (
            <button
              type="button"
              onClick={install}
              disabled={installing}
              className="mt-3 min-h-11 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {installing ? "…" : labels.install}
            </button>
          )}
        </div>
      </div>
      <button
        type="button"
        aria-label={labels.dismiss}
        onClick={dismiss}
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full text-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        ×
      </button>
    </aside>
  );
}
