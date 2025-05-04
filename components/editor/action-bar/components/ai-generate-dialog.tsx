"use client";

import { lazy, Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, Loader2 } from "lucide-react";
import type { JSONContent } from "@tiptap/react";
import { Loading } from "@/components/loading";

const CustomTextarea = lazy(
  () => import("@/components/editor/custom-textarea")
);

interface AIGenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
  onGenerate: (textPrompt: string, jsonPrompt: string) => void;
}

export function AIGenerateDialog({
  open,
  onOpenChange,
  loading,
  onGenerate,
}: AIGenerateDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [jsonPrompt, setJsonPrompt] = useState("");

  const handleContentChange = (
    textContent: string,
    jsonContent: JSONContent
  ) => {
    setJsonPrompt(JSON.stringify(jsonContent));
    setPrompt(textContent);
  };

  const handleGenerate = () => {
    onGenerate(prompt, jsonPrompt);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 pt-6 overflow-hidden rounded-lg border shadow-lg gap-6">
        <DialogHeader className="px-6">
          <DialogTitle>What can I do for your theme?</DialogTitle>
          <DialogDescription>
            Ask for anything in plain english, I'll make it happen.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6">
          <div className="bg-muted/40 rounded-lg p-1">
            <Suspense fallback={<Loading className="min-h-[80px]" />}>
              <CustomTextarea
                onContentChange={handleContentChange}
                onGenerate={handleGenerate}
              />
            </Suspense>
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            Try{" "}
            <em className="text-foreground font-medium">
              @Modern Minimal but in red
            </em>{" "}
            or{" "}
            <em className="text-foreground font-medium">
              Make the @Current Theme high contrast
            </em>
          </div>
        </div>

        <DialogFooter className="bg-muted/30 px-6 py-4 border-t">
          <div className="flex items-center justify-end w-full gap-2">
            <Button
              onClick={() => onOpenChange(false)}
              variant="ghost"
              disabled={loading}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              className="gap-1"
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Create Theme
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
