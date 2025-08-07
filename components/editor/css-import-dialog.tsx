import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/revola";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import React, { useState } from "react";

interface CssImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (css: string) => void;
}

const CssImportDialog: React.FC<CssImportDialogProps> = ({ open, onOpenChange, onImport }) => {
  const [cssText, setCssText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    // Basic validation - check if the CSS contains some expected variables
    if (!cssText.trim()) {
      setError("Please enter CSS content");
      return;
    }

    try {
      // Here you would add more sophisticated CSS parsing validation
      // For now we'll just do a simple check
      if (!cssText.includes("--") || !cssText.includes(":")) {
        setError(
          "Invalid CSS format. CSS should contain variable definitions like --primary: #color"
        );
        return;
      }

      onImport(cssText);
      setCssText("");
      setError(null);
      onOpenChange(false);
    } catch {
      setError("Failed to parse CSS. Please check your syntax.");
    }
  };

  const handleClose = () => {
    setCssText("");
    setError(null);
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="flex max-h-[90dvh] flex-col overflow-hidden shadow-lg sm:max-h-[min(640px,80dvh)] sm:max-w-[550px] sm:pt-6">
        <ScrollArea className="flex h-full flex-col" viewPortClassName="pb-2 *:space-y-6">
          <ResponsiveDialogHeader className="px-6">
            <ResponsiveDialogTitle>Import Custom CSS</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Paste your CSS file below to customize the theme colors. Make sure to include
              variables like --primary, --background, etc.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <div className="space-y-4 px-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="mr-2 size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Textarea
              placeholder={`:root {
  --background: 0 0% 100%;
  --foreground: oklch(0.52 0.13 144.17);
  --primary: #3e2723;
  /* And more */
}
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: hsl(37.50 36.36% 95.69%);
  --primary: rgb(46, 125, 50);
  /* And more */
}
            `}
              className="text-foreground min-h-[300px] font-mono text-sm"
              value={cssText}
              onChange={(e) => {
                setCssText(e.target.value);
                if (error) setError(null);
              }}
            />
          </div>
        </ScrollArea>

        <ResponsiveDialogFooter className="bg-muted/30 mt-4 border-t px-6 py-4 sm:mt-0">
          <Button variant="ghost" onClick={handleClose} size="sm" className="max-sm:w-full">
            Cancel
          </Button>
          <Button onClick={handleImport} size="sm" className="max-sm:w-full">
            Import
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default CssImportDialog;
