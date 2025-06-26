import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "@/actions/profile";
import { userProfileKeys } from "./use-user-profile-data";
import { toast } from "@/components/ui/use-toast";

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name?: string;
      bio?: string;
      twitterUrl?: string;
      githubUrl?: string;
      websiteUrl?: string;
    }) => updateUserProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(userProfileKeys.all, data);
      toast({ title: "Profile updated", description: "Your profile has been updated." });
    },
    onError: (error) => {
      toast({
        title: "Failed to update profile",
        description: (error as Error).message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}
