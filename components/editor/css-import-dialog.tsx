import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CssImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (css: string) => void;
}

const CssImportDialog: React.FC<CssImportDialogProps> = ({
  open,
  onOpenChange,
  onImport,
}) => {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] p-0 pt-6 overflow-hidden rounded-lg border shadow-lg gap-6">
        <DialogHeader className="px-6">
          <DialogTitle>
            Import Custom CSS
          </DialogTitle>
          <DialogDescription>
            Paste your CSS file below to customize the theme colors. Make sure
            to include variables like --primary, --background, etc.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 px-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
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
            className="min-h-[300px] font-mono text-sm text-foreground"
            value={cssText}
            onChange={(e) => {
              setCssText(e.target.value);
              if (error) setError(null);
            }}
          />
        </div>
        <DialogFooter className="bg-muted/30 px-6 py-4 border-t gap-2">
          <div className="flex items-center justify-end w-full gap-2">
            <Button
              variant="ghost"
              onClick={handleClose}
              size="sm"
              >
              Cancel
            </Button>
            <Button onClick={handleImport} size="sm">Import</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CssImportDialog;
