import { getMyCommunityProfile } from "@/actions/community-profiles";
import { Header } from "@/components/header";
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage how others see you on the platform
          </p>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-8">
          <ProfileForm profile={profile} />
        </div>
      </div>
    </div>
  );
}
