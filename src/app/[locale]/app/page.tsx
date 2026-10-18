import { getDictionary } from "@/lib/i18n";
import StoreDashboard from "@/components/store/store-dashboard";

export default async function StorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.app.store;

  return (
    <StoreDashboard
      labels={{
        title: t.title,
        level: t.level,
        producing: t.producing,
        claimIn: t.claimIn,
        claim: t.claim,
        claimed: t.claimed,
        streak: t.streak,
        league: t.league,
        upgrade: t.upgrade,
        upgradeDone: t.upgradeDone,
        insufficient: t.insufficient,
        coins: t.coins,
        cost: t.cost,
        loading: t.loading,
        error: t.error,
        ready: t.ready,
        boost: t.boost,
        maxLevel: t.maxLevel,
        max: t.max,
        upgradeButton: t.upgradeButton,
        paused: t.paused,
      }}
    />
  );
}
