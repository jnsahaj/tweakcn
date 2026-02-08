"use client";

import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TagSelector } from "@/components/tag-selector";
import { cn } from "@/lib/utils";
import { Globe, Loader2 } from "lucide-react";
import { useState } from "react";
import { usePublishTheme } from "@/hooks/themes";

interface PublishButtonProps {
  themeId: string;
  isPublished: boolean;
  disabled?: boolean;
  className?: string;
}

export function PublishButton({
  themeId,
  isPublished,
  disabled,
  className,
}: PublishButtonProps) {
  const publishMutation = usePublishTheme();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (isPublished) {
    return (
      <TooltipWrapper label="Published to community" asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("text-muted-foreground", className)}
          disabled
        >
          <Globe className="size-3.5" />
          <span className="hidden text-sm md:block">Published</span>
        </Button>
      </TooltipWrapper>
    );
  }

  const handleConfirmPublish = () => {
    publishMutation.mutate(
      { themeId, tags: selectedTags },
      {
        onSuccess: () => {
          setShowDialog(false);
          setSelectedTags([]);
        },
      }
    );
  };

  return (
    <>
      <TooltipWrapper label="Publish to community" asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(className)}
          disabled={disabled || publishMutation.isPending}
          onClick={() => setShowDialog(true)}
        >
          {publishMutation.isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Globe className="size-3.5" />
          )}
          <span className="hidden text-sm md:block">Publish</span>
        </Button>
      </TooltipWrapper>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish to the community?</DialogTitle>
            <DialogDescription>
              Your theme will be publicly visible on the community page. You can
              unpublish it at any time.
            </DialogDescription>
          </DialogHeader>
          <TagSelector
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            disabled={publishMutation.isPending}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPublish}
              disabled={publishMutation.isPending}
            >
              {publishMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
