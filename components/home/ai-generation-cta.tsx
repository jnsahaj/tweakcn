import { FrameHighlight } from "@/components/effects/frame-highlight";
import { NoiseEffect } from "@/components/effects/noise-effect";
import { AIChatDemo } from "@/components/examples/ai-chat-demo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function AIGenerationCTA() {
  return (
    <section
      id="ai-generation-cta"
      className="bg-muted/35 relative isolate w-full overflow-hidden py-20 md:py-32 lg:py-42"
    >
      <div className="relative isolate">
        <div className="relative z-10 container mx-auto w-full px-4 md:px-6">
          <div className="relative grid items-center gap-12 lg:grid-cols-2">
            {/* Left Column - Text Content */}
            <div className="mx-auto max-w-2xl lg:mx-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="justify-left relative flex flex-col items-start space-y-4"
              >
                <Badge
                  className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-none"
                  variant="secondary"
                >
                  <span className="text-primary mr-1">✦</span> Pro Features
                </Badge>
                <h2 className="from-foreground to-foreground/80 gap-2 bg-gradient-to-r bg-clip-text text-3xl leading-tight font-bold tracking-tight text-pretty text-transparent md:text-4xl lg:text-5xl">
                  Generate Themes With
                  <FrameHighlight className="text-primary">AI</FrameHighlight>
                  in Seconds
                </h2>
                <p className="text-muted-foreground mb-8 text-base leading-relaxed text-pretty md:text-lg">
                  Create stunning ready-to-use themes. Just provide an image or text prompt, and our
                  AI does the rest.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="border-primary/20 hover:border-primary/50 h-12 cursor-pointer rounded-full px-8 text-base transition-transform duration-250 hover:translate-y-[-2px]"
                  >
                    <Link href="/editor/theme?tab=ai">
                      Try it Free <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Visual Preview */}
            <div className="relative hidden flex-col items-center justify-center space-y-4 lg:flex">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className=""
              >
                <div className="border-border/50! relative h-[500px] overflow-hidden rounded-lg border-2 mask-b-from-80% mask-b-to-90% backdrop-blur-xs">
                  <NoiseEffect />

                  <AIChatDemo disabled={false} className="pb-16" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ----- Background effects ----- */}
        {/* Base */}
        <div
          className={cn(
            "-skew-12 mask-b-from-60% mask-l-from-40% mask-l-to-75%",
            "absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(from_var(--primary)_r_g_b_/_0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(from_var(--primary)_r_g_b_/_0.25)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]"
          )}
        />

        {/* Top Right - Primary */}
        <div
          className={cn(
            "-skew-12 animate-pulse [mask-composite:intersect]",
            "absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(from_var(--primary)_r_g_b_/_0.20)_1px,transparent_1px),linear-gradient(to_bottom,rgba(from_var(--primary)_r_g_b_/_0.20)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]",
            "[mask-image:linear-gradient(to_bottom,transparent_0%,transparent_25%,#000_25%,#000_50%,transparent_50%),linear-gradient(to_right,transparent_0%,transparent_50%,#000_50%,#000_100%)]"
          )}
        />

        {/* Bottom Left - Muted */}
        <div
          className={cn(
            "-skew-12",
            "absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(from_var(--muted)_r_g_b_/_0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(from_var(--muted)_r_g_b_/_0.25)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]",
            "[mask-image:linear-gradient(to_bottom,transparent_0%,transparent_50%,#000_50%,#000_75%,transparent_75%),linear-gradient(to_right,#000_0%,#000_50%,transparent_50%)]",
            "[mask-composite:intersect]"
          )}
        />
        {/* ----- Background effects ----- */}
      </div>
    </section>
  );
}
