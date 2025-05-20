import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SubmitCommunityThemeFormProps {
  onSubmit: (themeName: string) => void;
  isLoading: boolean;
}

const SubmitCommunityThemeForm: React.FC<SubmitCommunityThemeFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [themeName, setThemeName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = () => {
    if (!themeName.trim()) {
      setError("Theme name is required");
      return;
    }
    setError(null);
    onSubmit(themeName);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Submit Community Theme</DialogTitle>
        <DialogDescription>
          Your submission will be reviewed personally by me.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="theme-name" className="text-right">
            Theme Name
          </Label>
          <Input
            id="theme-name"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            className="col-span-3"
            disabled={isLoading}
          />
        </div>
        {error && (
          <div className="col-span-4 text-sm text-red-500 text-right">
            {error}
          </div>
        )}
      </div>
      <DialogFooter>
        <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default SubmitCommunityThemeForm;
