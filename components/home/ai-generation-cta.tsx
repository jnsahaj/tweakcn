import { AIChatDemo } from "@/components/examples/ai-chat-demo";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const aiFeatures = [
  "Theme preview in real time",
  "Checkpoint restoration",
  "Image color extraction",
  "Text-to-theme generation",
];

export function AIGenerationCTA() {
  return (
    <section
      id="ai-generation-cta"
      className="w-full border-b border-border/60"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-0">

          {/* Left: text */}
          <div className="py-16 md:py-24 border-r-0 lg:border-r border-border/60 pr-0 lg:pr-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="space-y-8 max-w-lg"
            >
              <div>
                <p className="label-eyebrow mb-4">Pro feature</p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                  Generate themes
                  <br />
                  <em className="not-italic font-light font-serif text-muted-foreground">in seconds.</em>
                </h2>
                <p className="mt-6 text-base text-muted-foreground leading-relaxed">
                  Provide an image or text prompt and our AI produces a production-ready shadcn/ui theme — colors, typography, and all.
                </p>
              </div>

              {/* Feature list */}
              <ul className="space-y-3">
                {aiFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3 pt-2">
                <Link href="/ai">
                  <Button
                    size="lg"
                    className="h-11 px-6 rounded-sm text-sm font-medium"
                  >
                    Generate with AI
                    <ArrowRight className="ml-2 size-3.5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-11 px-6 rounded-sm text-sm font-medium border-border/80"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right: demo */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="py-16 md:py-24 pl-0 lg:pl-16 flex items-center"
          >
            <div className="relative w-full hidden lg:block">
              <div className="overflow-hidden rounded-sm border border-border/60 bg-card shadow-sm">
                <div className="h-[500px] w-full p-4">
                  <AIChatDemo disabled={false} className="h-full pb-0 bg-transparent" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
