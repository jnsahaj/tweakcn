import ShadcnLogo from "@/assets/shadcn.svg";
import { Spotlight } from "@/components/effects/spotlight";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check, Circle, Copy, Eye, Palette } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative isolate container mx-auto w-full py-20 md:py-32 lg:py-40">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Spotlight
          className="top-0 left-0 -translate-x-1/3 -translate-y-1/3 opacity-50"
          fill="white"
        />
      </motion.div>

      <div className="relative z-10 px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Column - Text Content */}
          <div className="mx-auto max-w-2xl text-left lg:mx-0">
            <div>
              <Badge
                className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-none"
                variant="secondary"
              >
                <span className="text-primary mr-1">✦</span> Visual Theme Editor
              </Badge>
            </div>
            <h1 className="from-foreground via-foreground/90 to-foreground/70 mb-6 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl lg:text-6xl">
              Design Your <span className="font-serif font-light italic">Perfect</span>{" "}
              <span className="text-primary inline-flex items-baseline gap-1">
                <div className="bg-primary/10 flex items-center justify-center rounded-full p-1 md:p-2">
                  <ShadcnLogo className="size-6 md:size-8" />
                </div>
                <span>shadcn/ui</span>
              </span>{" "}
              Theme
            </h1>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed md:text-xl">
              Customize colors, typography, and layouts with a real-time preview. No signup
              required.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/editor/theme">
                <Button
                  size="lg"
                  className="h-12 cursor-pointer rounded-full px-8 text-base shadow-md transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-lg"
                >
                  Start Customizing
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <a href="#examples">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/20 hover:border-primary/50 h-12 cursor-pointer rounded-full px-8 text-base transition-transform duration-300 hover:translate-y-[-2px]"
                >
                  View Examples
                </Button>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Check className="text-primary size-5" />
                <span>Real-time Preview</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Check className="text-primary size-5" />
                <span>Export to Tailwind</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Check className="text-primary size-5" />
                <span>Beautiful Presets</span>
              </div>
            </div>
          </div>

          {/* Right Column - Preview Card */}
          <div className="relative hidden lg:block">
            <Card className="border-border/40 from-background to-background/95 relative overflow-hidden rounded-2xl bg-gradient-to-b shadow-xl backdrop-blur">
              <CardContent className="p-0">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="size-3 rounded-full bg-red-500"></div>
                      <div className="size-3 rounded-full bg-yellow-500"></div>
                      <div className="size-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-6 p-6">
                  {/* Color Palette */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Color Palette</div>
                      <Palette className="text-muted-foreground size-4" />
                    </div>
                    <div className="space-y-2 text-center">
                      <div className="from-primary via-secondary via-accent via-muted to-background h-24 w-full rounded-xl bg-gradient-to-r"></div>
                      <div className="text-muted-foreground grid grid-cols-5 gap-2 text-xs">
                        <div>Primary</div>
                        <div>Secondary</div>
                        <div>Accent</div>
                        <div>Muted</div>
                        <div>Background</div>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Preview</div>
                      <Eye className="text-muted-foreground size-4" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button className="w-full shadow-sm transition-none" variant="secondary">
                          <Copy className="mr-2 size-4" />
                          Copy Code
                        </Button>
                        <Button className="w-full shadow-sm transition-none" variant="outline">
                          <Circle className="mr-2 size-4" />
                          oklch, hsl, rgb, hex
                        </Button>
                      </div>
                      <Card className="w-full">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
                              <span className="text-primary text-xs">UI</span>
                            </div>
                            <div className="flex-1">
                              <div className="bg-foreground/90 mb-2 h-2 w-24 rounded"></div>
                              <div className="bg-muted-foreground/60 h-2 w-16 rounded"></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_90%_30%,var(--muted),transparent_35%)] blur-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_70%,var(--muted),transparent_10%)] blur-3xl"></div>
    </section>
  );
}
