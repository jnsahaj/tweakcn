import React from "react";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_FONT_MONO, DEFAULT_FONT_SANS, DEFAULT_FONT_SERIF } from "@/config/theme";
import { useEditorStore } from "@/store/editor-store";
import { ThemeStyleProps } from "@/types/theme";
import { getAppliedThemeFont, monoFonts, sansSerifFonts, serifFonts } from "@/utils/theme-fonts";
import ControlSection, { ControlSectionRef } from "./control-section";
import { SliderWithInput } from "./slider-with-input";
import ThemeFontSelect from "./theme-font-select";

interface TypographyControlsTabProps {
  currentStyles: ThemeStyleProps;
  updateStyle: <K extends keyof ThemeStyleProps>(key: K, value: ThemeStyleProps[K]) => void;
  sectionRefs: Record<string, React.RefObject<ControlSectionRef | null>>;
}

export const TypographyControlsTab: React.FC<TypographyControlsTabProps> = ({
  currentStyles,
  updateStyle,
  sectionRefs,
}) => {
  const { themeState } = useEditorStore();

  return (
    <ScrollArea className="h-full px-4">
      <div className="bg-muted/50 mb-4 flex items-start gap-2.5 rounded-md border p-3">
        <AlertCircle className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
        <div className="text-muted-foreground text-sm">
          <p>
            To use custom fonts, embed them in your project. <br />
            See{" "}
            <a
              href="https://tailwindcss.com/docs/font-family"
              target="_blank"
              className="hover:text-muted-foreground/90 underline underline-offset-2"
            >
              Tailwind docs
            </a>{" "}
            for details.
          </p>
        </div>
      </div>

      <ControlSection title="Font Family" expanded ref={sectionRefs["Font Family"]}>
        <div className="mb-4" data-entity="font-sans">
          <Label htmlFor="font-sans" className="mb-1.5 block text-xs">
            Sans-Serif Font
          </Label>
          <ThemeFontSelect
            fonts={{ ...sansSerifFonts, ...serifFonts, ...monoFonts }}
            defaultValue={DEFAULT_FONT_SANS}
            currentFont={getAppliedThemeFont(themeState, "font-sans")}
            onFontChange={(value) => updateStyle("font-sans", value)}
          />
        </div>

        <Separator className="my-4" />

        <div className="mb-4" data-entity="font-serif">
          <Label htmlFor="font-serif" className="mb-1.5 block text-xs">
            Serif Font
          </Label>
          <ThemeFontSelect
            fonts={{ ...serifFonts, ...sansSerifFonts, ...monoFonts }}
            defaultValue={DEFAULT_FONT_SERIF}
            currentFont={getAppliedThemeFont(themeState, "font-serif")}
            onFontChange={(value) => updateStyle("font-serif", value)}
          />
        </div>

        <Separator className="my-4" />
        <div data-entity="font-mono">
          <Label htmlFor="font-mono" className="mb-1.5 block text-xs">
            Monospace Font
          </Label>
          <ThemeFontSelect
            fonts={{ ...monoFonts, ...sansSerifFonts, ...serifFonts }}
            defaultValue={DEFAULT_FONT_MONO}
            currentFont={getAppliedThemeFont(themeState, "font-mono")}
            onFontChange={(value) => updateStyle("font-mono", value)}
          />
        </div>
      </ControlSection>

      <ControlSection title="Letter Spacing" expanded ref={sectionRefs["Letter Spacing"]}>
        <div data-entity="letter-spacing">
          <SliderWithInput
            value={parseFloat(currentStyles["letter-spacing"]?.replace("em", ""))}
            onChange={(value) => updateStyle("letter-spacing", `${value}em`)}
            min={-0.5}
            max={0.5}
            step={0.025}
            unit="em"
            label="Letter Spacing"
          />
        </div>
      </ControlSection>
    </ScrollArea>
  );
};
