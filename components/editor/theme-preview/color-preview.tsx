import { CopyButton } from "@/components/copy-button";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FocusColorId, useColorControlFocus } from "@/store/color-control-focus-store";
import { ThemeEditorPreviewProps } from "@/types/theme";
import { SquarePen } from "lucide-react";

interface ColorPreviewProps {
  styles: ThemeEditorPreviewProps["styles"];
  currentMode: ThemeEditorPreviewProps["currentMode"];
}

function ColorPreviewItem({ label, color, name }: { label: string; color: string; name: string }) {
  const { focusColor } = useColorControlFocus();

  return (
    <div className="group/color-preview hover:bg-muted/60 relative flex items-center gap-2 rounded-md p-1 transition-colors">
      <div
        className="size-14 shrink-0 rounded-md border @max-3xl:size-12"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 space-y-1 overflow-hidden">
        <p className="line-clamp-2 text-sm leading-tight font-medium @max-3xl:text-xs">{label}</p>
        <p className="text-muted-foreground truncate font-mono text-xs">{color}</p>
      </div>

      <div className="hidden flex-col opacity-0 transition-opacity group-hover/color-preview:opacity-100 md:flex">
        <TooltipWrapper label="Edit color" asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => focusColor(name as FocusColorId)}
            className="size-7 @max-3xl:size-6 [&>svg]:size-3.5"
          >
            <SquarePen />
          </Button>
        </TooltipWrapper>
        <CopyButton textToCopy={color} className="size-7 @max-3xl:size-6" />
      </div>
    </div>
  );
}

const ColorPreview = ({ styles, currentMode }: ColorPreviewProps) => {
  if (!styles || !styles[currentMode]) {
    return null;
  }

  return (
    <div className="@container grid grid-cols-1 gap-4 md:gap-8">
      {/* Primary Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">Primary Theme Colors</h3>
        <div className="@6xl grid grid-cols-1 gap-2 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem
            label="Background"
            color={styles[currentMode].background}
            name="background"
          />
          <ColorPreviewItem
            label="Foreground"
            color={styles[currentMode].foreground}
            name="foreground"
          />
          <ColorPreviewItem label="Primary" color={styles[currentMode].primary} name="primary" />
          <ColorPreviewItem
            label="Primary Foreground"
            color={styles[currentMode]["primary-foreground"]}
            name="primary-foreground"
          />
        </div>
      </div>

      <Separator />

      {/* Secondary & Accent Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">Secondary & Accent Colors</h3>
        <div className="@6xl grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem
            label="Secondary"
            color={styles[currentMode].secondary}
            name="secondary"
          />
          <ColorPreviewItem
            label="Secondary Foreground"
            color={styles[currentMode]["secondary-foreground"]}
            name="secondary-foreground"
          />
          <ColorPreviewItem label="Accent" color={styles[currentMode].accent} name="accent" />
          <ColorPreviewItem
            label="Accent Foreground"
            color={styles[currentMode]["accent-foreground"]}
            name="accent-foreground"
          />
        </div>
      </div>

      <Separator />

      {/* UI Component Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">UI Component Colors</h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem label="Card" color={styles[currentMode].card} name="card" />
          <ColorPreviewItem
            label="Card Foreground"
            color={styles[currentMode]["card-foreground"]}
            name="card-foreground"
          />
          <ColorPreviewItem label="Popover" color={styles[currentMode].popover} name="popover" />
          <ColorPreviewItem
            label="Popover Foreground"
            color={styles[currentMode]["popover-foreground"]}
            name="popover-foreground"
          />
          <ColorPreviewItem label="Muted" color={styles[currentMode].muted} name="muted" />
          <ColorPreviewItem
            label="Muted Foreground"
            color={styles[currentMode]["muted-foreground"]}
            name="muted-foreground"
          />
        </div>
      </div>

      <Separator />

      {/* Utility & Form Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">Utility & Form Colors</h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem label="Border" color={styles[currentMode].border} name="border" />
          <ColorPreviewItem label="Input" color={styles[currentMode].input} name="input" />
          <ColorPreviewItem label="Ring" color={styles[currentMode].ring} name="ring" />
        </div>
      </div>

      <Separator />

      {/* Status & Feedback Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">Status & Feedback Colors</h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem
            label="Destructive"
            color={styles[currentMode].destructive}
            name="destructive"
          />
          <ColorPreviewItem
            label="Destructive Foreground"
            color={styles[currentMode]["destructive-foreground"]}
            name="destructive-foreground"
          />
        </div>
      </div>

      <Separator />

      {/* Chart & Data Visualization Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          Chart & Visualization Colors
        </h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem label="Chart 1" color={styles[currentMode]["chart-1"]} name="chart-1" />
          <ColorPreviewItem label="Chart 2" color={styles[currentMode]["chart-2"]} name="chart-2" />
          <ColorPreviewItem label="Chart 3" color={styles[currentMode]["chart-3"]} name="chart-3" />
          <ColorPreviewItem label="Chart 4" color={styles[currentMode]["chart-4"]} name="chart-4" />
          <ColorPreviewItem label="Chart 5" color={styles[currentMode]["chart-5"]} name="chart-5" />
        </div>
      </div>

      <Separator />

      {/* Sidebar Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">Sidebar & Navigation Colors</h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem
            label="Sidebar Background"
            color={styles[currentMode].sidebar}
            name="sidebar"
          />
          <ColorPreviewItem
            label="Sidebar Foreground"
            color={styles[currentMode]["sidebar-foreground"]}
            name="sidebar-foreground"
          />
          <ColorPreviewItem
            label="Sidebar Primary"
            color={styles[currentMode]["sidebar-primary"]}
            name="sidebar-primary"
          />
          <ColorPreviewItem
            label="Sidebar Primary Foreground"
            color={styles[currentMode]["sidebar-primary-foreground"]}
            name="sidebar-primary-foreground"
          />
          <ColorPreviewItem
            label="Sidebar Accent"
            color={styles[currentMode]["sidebar-accent"]}
            name="sidebar-accent"
          />
          <ColorPreviewItem
            label="Sidebar Accent Foreground"
            color={styles[currentMode]["sidebar-accent-foreground"]}
            name="sidebar-accent-foreground"
          />
          <ColorPreviewItem
            label="Sidebar Border"
            color={styles[currentMode]["sidebar-border"]}
            name="sidebar-border"
          />
          <ColorPreviewItem
            label="Sidebar Ring"
            color={styles[currentMode]["sidebar-ring"]}
            name="sidebar-ring"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPreview;
