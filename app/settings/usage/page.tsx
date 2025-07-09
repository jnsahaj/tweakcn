import { UsageStats } from "@/app/settings/components/usage-stats";
import { SettingsHeader } from "../components/settings-header";

export default function UsagePage() {
  return (
    <div>
      <SettingsHeader title="AI Usage" description="Track your AI theme generation requests" />
      <UsageStats />
    </div>
  );
}
