import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check, Copy, Circle, Eye, Palette } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="container mx-auto w-full py-20 md:py-32 lg:py-40 relative isolate">
      <div className="px-4 md:px-6 z-10 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-left max-w-2xl mx-auto lg:mx-0">
            <div>
              <Badge
                className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-none"
                variant="secondary"
              >
                <span className="mr-1 text-primary">✦</span> Visual Theme Editor
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70">
              Design Your Perfect <span className="text-primary">shadcn/ui</span>{" "}
              Theme
            </h1>
            <p className="text-muted-foreground mb-8 text-lg md:text-xl leading-relaxed">
              Customize colors, typography, and layouts with a real-time preview. No
              signup required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/editor/theme">
                <Button
                  size="lg"
                  className="rounded-full h-12 px-8 cursor-pointer shadow-md hover:shadow-lg transition-transform duration-300 hover:translate-y-[-2px] text-base"
                >
                  Start Customizing
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <a href="#examples">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-8 cursor-pointer border-primary/20 hover:border-primary/50 transition-transform duration-300 hover:translate-y-[-2px] text-base"
                >
                  View Examples
                </Button>
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="size-5 text-primary" />
                <span>Real-time Preview</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="size-5 text-primary" />
                <span>Export to Tailwind</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="size-5 text-primary" />
                <span>Beautiful Presets</span>
              </div>
            </div>
          </div>

          {/* Right Column - Preview Card */}
          <div className="relative hidden lg:block">
            <Card className="relative overflow-hidden border-border/40 bg-gradient-to-b from-background to-background/95 backdrop-blur shadow-xl rounded-2xl">
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
                <div className="p-6 space-y-6">
                  {/* Color Palette */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Color Palette</div>
                      <Palette className="size-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-2 text-center">
                      <div className="h-24 w-full bg-gradient-to-r from-primary via-secondary via-accent via-muted to-background rounded-xl"></div>
                      <div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground">
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
                      <Eye className="size-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button
                          className="w-full shadow-sm transition-none"
                          variant="secondary"
                        >
                          <Copy className="size-4 mr-2" />
                          Copy Code
                        </Button>
                        <Button
                          className="w-full shadow-sm transition-none"
                          variant="outline"
                        >
                          <Circle className="size-4 mr-2" />
                          oklch, hsl, rgb, hex
                        </Button>
                      </div>
                      <Card className="w-full">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs text-primary">UI</span>
                            </div>
                            <div className="flex-1">
                              <div className="h-2 w-24 bg-foreground/90 rounded mb-2"></div>
                              <div className="h-2 w-16 bg-muted-foreground/60 rounded"></div>
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
