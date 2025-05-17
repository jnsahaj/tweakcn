"use client";

import { Heart } from "lucide-react";
import { useOptimisticLike } from "../hooks/use-optimistic-like";

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
  const { optimisticIsLiked, optimisticLikesCount, handleLikeToggle } = useOptimisticLike({
    themeId,
    initialIsLiked,
    initialLikesCount,
  });

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    await handleLikeToggle();
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center space-x-1 text-sm focus:outline-none ${className}`}
      aria-label={optimisticIsLiked ? "Unlike theme" : "Like theme"}
      type="button"
    >
      <Heart
        fill={optimisticIsLiked ? "currentColor" : "none"}
        className={`h-4 w-4 ${
          optimisticIsLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
        } transition-colors`}
      />
      {optimisticLikesCount > 0 && (
        <span
          className={
            optimisticIsLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
          }
        >
          {optimisticLikesCount}
        </span>
      )}
    </button>
  );
}
