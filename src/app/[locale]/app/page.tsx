import { getDictionary } from "@/lib/i18n";
import AppPromoCarousel from "@/components/app-promo-carousel";
import StoreDashboard from "@/components/store/store-dashboard";

export default async function StorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.app.store;
  const promo = dict.app.dashboard;

  return (
    <div className="space-y-5">
      <AppPromoCarousel
        locale={locale}
        labels={{
          storeTitle: promo.storeTitle,
          storeDescription: promo.storeDescription,
          storeAction: promo.storeAction,
          storeAlt: promo.storeAlt,
          missionsTitle: promo.missionsTitle,
          missionsDescription: promo.missionsDescription,
          missionsAction: promo.missionsAction,
          missionsAlt: promo.missionsAlt,
          communityTitle: promo.communityTitle,
          communityDescription: promo.communityDescription,
          communityAction: promo.communityAction,
          communityAlt: promo.communityAlt,
          previous: promo.previous,
          next: promo.next,
          goToSlide: promo.goToSlide,
        }}
      />

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
          coinNote: t.coinNote,
          cost: t.cost,
          loading: t.loading,
          error: t.error,
          ready: t.ready,
          boost: t.boost,
          maxLevel: t.maxLevel,
          max: t.max,
          upgradeButton: t.upgradeButton,
          paused: t.paused,
          balanceUnavailable: t.balanceUnavailable,
          retry: t.retry,
        }}
      />
    </div>
  );
}
