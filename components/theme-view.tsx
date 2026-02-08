"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useEditorStore } from "@/store/editor-store";
import { useToggleLike } from "@/hooks/themes";
import { useSessionGuard } from "@/hooks/use-guards";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import type { Theme } from "@/types/theme";
import { cn } from "@/lib/utils";
import { Edit, Heart, Moon, MoreVertical, Share, Sun } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CodeButton } from "./editor/action-bar/components/code-button";
import { CodePanelDialog } from "./editor/code-panel-dialog";
import ThemePreviewPanel from "./editor/theme-preview-panel";
import { DialogActionsProvider } from "@/hooks/use-dialog-actions";

interface CommunityData {
  communityThemeId: string;
  author: { id: string; name: string; image: string | null };
  likeCount: number;
  publishedAt: string;
}

interface ThemeViewProps {
  theme: Theme;
  communityData?: CommunityData | null;
}

export default function ThemeView({ theme, communityData }: ThemeViewProps) {
  const { themeState, setThemeState, saveThemeCheckpoint, restoreThemeCheckpoint } =
    useEditorStore();
  const router = useRouter();
  const currentMode = themeState.currentMode;
  const [codePanelOpen, setCodePanelOpen] = useState(false);

  useEffect(() => {
    saveThemeCheckpoint();
    setThemeState({
      ...themeState,
      styles: theme.styles,
    });
    return () => {
      restoreThemeCheckpoint();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, saveThemeCheckpoint, setThemeState, restoreThemeCheckpoint]);

  if (!theme) {
    notFound();
  }

  const toggleTheme = () => {
    setThemeState({
      ...themeState,
      currentMode: currentMode === "light" ? "dark" : "light",
    });
  };

  const handleOpenInEditor = () => {
    setThemeState({
      ...themeState,
      styles: theme.styles,
    });
    saveThemeCheckpoint();
    router.push("/editor/theme");
  };

  const handleShare = () => {
    const url = `https://tweakcn.com/themes/${theme.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Theme URL copied to clipboard!",
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{theme.name}</h1>
          {communityData && <CommunityAuthorInfo communityData={communityData} />}
        </div>
        <div className="flex items-center gap-2">
          {communityData && (
            <LikeButton communityData={communityData} />
          )}
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {currentMode === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <CodeButton variant="outline" size="default" onClick={() => setCodePanelOpen(true)} />
          <Button variant="outline" size="default" onClick={handleShare}>
            <Share className="size-4" />
            Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2" onClick={handleOpenInEditor}>
                <Edit className="size-4" />
                Open in Editor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DialogActionsProvider>
        <div className="-m-4 mt-6 flex h-[min(80svh,900px)] flex-col">
          <ThemePreviewPanel styles={theme.styles} currentMode={currentMode} />
        </div>

        <CodePanelDialog
          open={codePanelOpen}
          onOpenChange={setCodePanelOpen}
          themeEditorState={themeState}
        />
      </DialogActionsProvider>
    </>
  );
}

function CommunityAuthorInfo({ communityData }: { communityData: CommunityData }) {
  const authorInitials = communityData.author.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span className="text-sm">by</span>
      <Avatar className="h-5 w-5">
        {communityData.author.image && (
          <AvatarImage
            src={communityData.author.image}
            alt={communityData.author.name}
          />
        )}
        <AvatarFallback className="text-[9px]">{authorInitials}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{communityData.author.name}</span>
    </div>
  );
}

function LikeButton({ communityData }: { communityData: CommunityData }) {
  const toggleLike = useToggleLike();
  const { checkValidSession } = useSessionGuard();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(communityData.likeCount);

  usePostLoginAction("LIKE_THEME", (data?: { communityThemeId: string }) => {
    if (data?.communityThemeId === communityData.communityThemeId) {
      toggleLike.mutate(communityData.communityThemeId, {
        onSuccess: (result) => {
          setLiked(result.liked);
          setCount(result.likeCount);
        },
      });
    }
  });

  const handleLike = () => {
    if (
      !checkValidSession("signin", "LIKE_THEME", {
        communityThemeId: communityData.communityThemeId,
      })
    ) {
      return;
    }

    // Optimistic update
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));

    toggleLike.mutate(communityData.communityThemeId, {
      onSuccess: (result) => {
        setLiked(result.liked);
        setCount(result.likeCount);
      },
      onError: () => {
        // Rollback
        setLiked((prev) => !prev);
        setCount((prev) => (liked ? prev + 1 : prev - 1));
      },
    });
  };

  return (
    <Button
      variant="outline"
      size="default"
      onClick={handleLike}
      className={cn(liked && "text-red-500")}
    >
      <Heart className={cn("size-4", liked && "fill-current")} />
      {count > 0 && <span>{count}</span>}
    </Button>
  );
}
