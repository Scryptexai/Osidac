import { getDictionary } from "@/lib/i18n";
import NetworkDashboard from "@/components/network/network-dashboard";

export default async function NetworkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.app.network;

  return (
    <NetworkDashboard
      labels={{
        title: t.title,
        branches: t.branches,
        commission: t.commission,
        rank: t.rank,
        invite: t.invite,
        copy: t.copy,
        copied: t.copied,
        loading: t.loading,
        level: t.level,
        total: t.total,
        direct: t.direct,
        shareNote: t.shareNote,
      }}
    />
  );
}
