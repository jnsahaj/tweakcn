import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor-store";
import { motion } from "motion/react";
import { getPresetThemeStyles, presets } from "@/utils/theme-presets";
import { cn } from "@/lib/utils";
import { colorFormatter } from "@/utils/color-converter";
import { DemoContainer } from "@/components/examples/demo-cards";
import { DemoGithub } from "@/components/examples/cards/github-card";
import { DemoStats } from "@/components/examples/cards/stats";
import { lazy, Suspense } from "react";
import { Loading } from "../loading";

const DemoMail = lazy(() => import("@/components/examples/mail"));

const ColorBox = ({ color }: { color: string }) => {
  return (
    <div className="w-3 h-3 rounded-sm border" style={{ backgroundColor: color }} />
  );
};

export function ThemePresetSelector() {
  const { themeState, applyThemePreset } = useEditorStore();
  const mode = themeState.currentMode;
  const presetNames = Object.keys(presets);

  return (
    <section id="examples" className="w-full py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge
              className="rounded-full px-4 py-1.5 text-sm font-medium shadow-sm"
              variant="secondary"
            >
              <span className="mr-1 text-primary">✦</span> Theme Presets
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Preview and Select a Theme
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Click on a theme below to preview how it transforms the page.
          </p>
        </motion.div>

        {/* Theme Selector Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8"
        >
          {presetNames?.slice(4, 10).map((presetName, index) => {
            const themeStyles = getPresetThemeStyles(presetName)[mode];
            const bgColor = colorFormatter(themeStyles.primary, "hsl", "4");
            const isSelected = presetName === themeState.preset;
            return (
              <motion.div
                key={presetName}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <Button
                  className={cn(
                    "flex w-full items-center relative transition-all hover:shadow-md bg-primary/10 hover:bg-primary/20 hover:translate-y-[-2px]",
                    isSelected ? "ring-2 ring-primary/30 shadow-md" : ""
                  )}
                  variant="ghost"
                  style={{
                    backgroundColor: bgColor
                      .replace("hsl", "hsla")
                      .replace(/\s+/g, ", ")
                      .replace(")", ", 0.15)"),
                    color: themeStyles.foreground,
                    borderRadius: themeStyles.radius,
                  }}
                  onClick={() => applyThemePreset(presetName)}
                >
                  <div className="flex gap-0.5 mr-1">
                    <ColorBox color={themeStyles.primary} />
                    <ColorBox color={themeStyles.accent} />
                  </div>
                  <span className="capitalize">{presetName.replace(/-/g, " ")}</span>
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="@container relative overflow-hidden border rounded-lg max-h-[60vh] md:max-h-[70vh] shadow-lg bg-gradient-to-b from-card/50 to-card/30 backdrop-blur-sm"
        >
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0), var(--background))",
            }}
          />
          <Suspense fallback={<Loading />}>
            <div className="hidden md:block">
              <DemoMail />
            </div>
            <div className="block md:hidden p-4 flex flex-col gap-4">
              <DemoContainer>
                <DemoStats />
              </DemoContainer>
              <DemoContainer>
                <DemoGithub />
              </DemoContainer>
            </div>
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
}
