"use client";

import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
    publishMutation.mutate(themeId, {
      onSuccess: () => {
        setShowDialog(false);
      },
    });
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

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish to the community?</AlertDialogTitle>
            <AlertDialogDescription>
              Your theme will be visible to everyone on the community page.
              Others will be able to view, like, and open it in the editor. You
              can unpublish it at any time from your settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
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
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
