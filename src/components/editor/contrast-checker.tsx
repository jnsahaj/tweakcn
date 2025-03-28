import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useContrastChecker } from "../../hooks/use-contrast-checker";
import { ThemeStyleProps } from "@/types/theme";

type ContrastCheckerProps = {
  currentStyles: ThemeStyleProps | Partial<ThemeStyleProps>;
};

const ContrastChecker = ({ currentStyles }: ContrastCheckerProps) => {
  const colorPairsToCheck = [
    {
      id: "background",
      foreground: currentStyles?.["foreground"],
      background: currentStyles?.["background"],
      label: "Background",
    },
    {
      id: "card",
      foreground: currentStyles?.["card-foreground"],
      background: currentStyles?.["card"],
      label: "Card",
    },
    {
      id: "popover",
      foreground: currentStyles?.["popover-foreground"],
      background: currentStyles?.["popover"],
      label: "Popover",
    },
    {
      id: "primary",
      foreground: currentStyles?.["primary-foreground"],
      background: currentStyles?.["primary"],
      label: "Primary",
    },
    {
      id: "secondary",
      foreground: currentStyles?.["secondary-foreground"],
      background: currentStyles?.["secondary"],
      label: "Secondary",
    },
    {
      id: "muted",
      foreground: currentStyles?.["muted-foreground"],
      background: currentStyles?.["muted"],
      label: "Muted",
    },
    {
      id: "accent",
      foreground: currentStyles?.["accent-foreground"],
      background: currentStyles?.["accent"],
      label: "Accent",
    },
    {
      id: "destructive",
      foreground: currentStyles?.["destructive-foreground"],
      background: currentStyles?.["destructive"],
      label: "Destructive",
    },
    {
      id: "sidebar",
      foreground: currentStyles?.["sidebar-foreground"],
      background: currentStyles?.["sidebar"],
      label: "Sidebar",
    },
    {
      id: "sidebar-primary",
      foreground: currentStyles?.["sidebar-primary-foreground"],
      background: currentStyles?.["sidebar-primary"],
      label: "Sidebar Primary",
    },
    {
      id: "sidebar-accent",
      foreground: currentStyles?.["sidebar-accent-foreground"],
      background: currentStyles?.["sidebar-accent"],
      label: "Sidebar Accent",
    },
  ];

  const { failingPairs, hasFailingContrast, minimumRequiredRatio } =
    useContrastChecker(
      colorPairsToCheck.filter((pair) => pair.foreground && pair.background)
    );

  if (!hasFailingContrast) {
    return null;
  }

  return (
    <div className="mb-6 ml-1">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Insufficient contrast warning</AlertTitle>
        <AlertDescription>
          <p>
            The following color pairs don't meet the minimum contrast ratio (
            {minimumRequiredRatio}):
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            {failingPairs.map((pair, idx) => (
              <li key={idx}>{pair}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ContrastChecker;
