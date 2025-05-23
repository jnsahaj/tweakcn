import { getMyCommunityProfile } from "@/actions/community-profiles";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";
import { ProfileClient } from "./components/profile-client";

export default async function ProfilePage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/");
  }

  const profile = await getMyCommunityProfile();

  return <ProfileClient profile={profile} />;
}
