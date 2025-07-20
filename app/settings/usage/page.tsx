import { UsageStats } from "@/app/settings/components/usage-stats";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SettingsHeader } from "../components/settings-header";

export default async function UsagePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/editor/theme");

  return (
    <div>
      <SettingsHeader title="AI Usage" description="Track your AI theme generation requests" />
      <UsageStats />
    </div>
  );
}
