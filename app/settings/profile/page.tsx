import { getMyCommunityProfile } from "@/actions/community-profiles";
import { ProfileForm } from "./components/profile-form";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";

export default async function ProfilePage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/");
  }

  const profile = await getMyCommunityProfile();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage how others see you on the platform</p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
