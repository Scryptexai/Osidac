import { getDictionary } from "@/lib/i18n";
import WalletDashboard from "@/components/wallet/wallet-dashboard";

export default async function WalletPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.app.wallet;

  return (
    <WalletDashboard
      labels={{
        title: t.title,
        coins: t.coins,
        cash: t.cash,
        cashNote: t.cashNote,
        coinNote: t.coinNote,
        history: t.history,
        loading: t.loading,
        empty: t.empty,
        locale,
        claimEntry: t.claimEntry,
        upgradeEntry: t.upgradeEntry,
        missionEntry: t.missionEntry,
        bonusEntry: t.bonusEntry,
        otherEntry: t.otherEntry,
      }}
    />
  );
}
