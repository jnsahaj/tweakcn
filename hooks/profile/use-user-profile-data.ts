import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/actions/profile";

export const userProfileKeys = {
  all: ["userProfile"] as const,
};

export function useUserProfileData(initialData?: Awaited<ReturnType<typeof getUserProfile>>) {
  return useQuery({
    queryKey: userProfileKeys.all,
    queryFn: getUserProfile,
    initialData,
    staleTime: 1000 * 60 * 5,
  });
}
