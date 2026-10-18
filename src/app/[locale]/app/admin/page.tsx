import { getDictionary } from "@/lib/i18n";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return <AdminDashboard locale={locale} labels={dict.app.admin} />;
}
