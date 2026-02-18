import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SettingsHeader } from "../components/settings-header";
import { DeleteAccountSection } from "./components/delete-account-section";

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/editor/theme");

  return (
    <div>
      <SettingsHeader
        title="Account"
        description="Manage your account settings"
      />
      <DeleteAccountSection />
    </div>
  );
}
