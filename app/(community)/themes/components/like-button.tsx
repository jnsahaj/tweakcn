"use client";

import { useOptimistic, startTransition } from "react";
import { Heart } from "lucide-react";
import { likeCommunityTheme, unlikeCommunityTheme } from "@/actions/community-themes";

interface LikeButtonProps {
  themeId: string;
  initialIsLiked: boolean;
  initialLikesCount: number;
  className?: string;
}

export function LikeButton({
  themeId,
  initialIsLiked,
  initialLikesCount,
  className,
}: LikeButtonProps) {
  const [optimisticState, setOptimisticState] = useOptimistic(
    { isLiked: initialIsLiked, likesCount: initialLikesCount },
    (currentState) => ({
      isLiked: !currentState.isLiked,
      likesCount: !currentState.isLiked ? currentState.likesCount + 1 : currentState.likesCount - 1,
    })
  );

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const actionToPerform = optimisticState.isLiked ? unlikeCommunityTheme : likeCommunityTheme;

    startTransition(() => {
      setOptimisticState({
        isLiked: optimisticState.isLiked,
        likesCount: optimisticState.likesCount,
      });
    });

    try {
      await actionToPerform(themeId);
      // Server actions revalidatePath, so no need to do it here.
    } catch (error) {
      // Handle potential errors, e.g., revert optimistic update or show a toast
      console.error("Failed to update like status:", error);
      // Revert optimistic update by setting it back to initial state (or previous server state)
      // This part can be enhanced based on error handling strategy
      startTransition(() => {
        setOptimisticState({ isLiked: initialIsLiked, likesCount: initialLikesCount });
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center space-x-1 text-sm focus:outline-none ${className}`}
      aria-label={optimisticState.isLiked ? "Unlike theme" : "Like theme"}
      type="button"
    >
      <Heart
        fill={optimisticState.isLiked ? "currentColor" : "none"}
        className={`h-4 w-4 ${
          optimisticState.isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
        } transition-colors`}
      />
      {optimisticState.likesCount > 0 && (
        <span
          className={
            optimisticState.isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
          }
        >
          {optimisticState.likesCount}
        </span>
      )}
    </button>
  );
}
