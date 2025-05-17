"use client";

import { useOptimistic, startTransition } from "react";
import { likeCommunityTheme, unlikeCommunityTheme } from "@/actions/community-themes";

interface UseOptimisticLikeProps {
  themeId: string;
  initialIsLiked: boolean;
  initialLikesCount: number;
}

export function useOptimisticLike({
  themeId,
  initialIsLiked,
  initialLikesCount,
}: UseOptimisticLikeProps) {
  const [optimisticState, setOptimisticState] = useOptimistic({
    isLiked: initialIsLiked,
    likesCount: initialLikesCount,
  });

  const handleLikeToggle = async () => {
    const newIsLiked = !optimisticState.isLiked;
    const newLikesCount = newIsLiked
      ? optimisticState.likesCount + 1
      : optimisticState.likesCount - 1;

    const actionToPerform = optimisticState.isLiked ? unlikeCommunityTheme : likeCommunityTheme;

    startTransition(() => {
      setOptimisticState({
        isLiked: newIsLiked,
        likesCount: newLikesCount,
      });
    });

    try {
      await actionToPerform(themeId);
    } catch (error) {
      console.error("Failed to update like status:", error);
      startTransition(() => {
        setOptimisticState({ isLiked: initialIsLiked, likesCount: initialLikesCount });
      });
    }
  };

  return {
    optimisticIsLiked: optimisticState.isLiked,
    optimisticLikesCount: optimisticState.likesCount,
    handleLikeToggle,
  };
}
