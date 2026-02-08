import { AIChatDemo } from "@/components/examples/ai-chat-demo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function AIGenerationCTA() {
  return (
    <section
      id="ai-generation-cta"
      className="bg-muted/35 relative isolate w-full overflow-hidden py-24 md:py-32 lg:py-40"
    >
      <div className="relative isolate">
        <div className="relative z-10 container mx-auto w-full px-4 md:px-6">
          <div className="relative grid items-center gap-16 lg:grid-cols-2">
            {/* Left Column - Text Content */}
            <div className="mx-auto max-w-2xl lg:mx-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="justify-left relative flex flex-col items-start gap-6">
                  <h2 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                    Generate Themes in <br />
                    <span className="text-primary font-serif italic">Seconds</span>
                  </h2>
                  <p className="text-muted-foreground max-w-lg text-lg leading-relaxed md:text-xl">
                    Just provide an image or text prompt, and our AI will create a stunning,
                    production-ready theme for you.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/ai">
                    <Button
                      size="lg"
                      className="hover:shadow-primary/25 h-14 rounded-full px-8 text-lg shadow-lg transition-all hover:scale-105"
                    >
                      Generate with AI <ArrowRight className="ml-2 size-5" />
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-primary/20 bg-background/50 hover:bg-accent/50 h-14 rounded-full px-8 text-lg backdrop-blur-sm"
                    >
                      View Pricing
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
                  {[
                    "Theme Preview",
                    "Checkpoint Restoration",
                    "Image Extraction",
                    "Text-to-Theme",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="text-muted-foreground flex items-center gap-3 text-base"
                    >
                      <div className="bg-primary/10 flex size-6 items-center justify-center rounded-full">
                        <Check className="text-primary size-3.5" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Visual Preview */}
            <div className="relative hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                {/* Glassmorphism Container */}
                <div className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-black/5">
                  <div className="relative h-[550px] w-full p-6">
                    <AIChatDemo disabled={false} className="h-full pb-0 bg-transparent" />
                  </div>
                </div>

                {/* Background Glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl -z-10 rounded-full opacity-50" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
