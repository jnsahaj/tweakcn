import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="w-full border-b border-border/60 bg-foreground text-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-20 md:py-28 flex flex-col md:flex-row items-start md:items-end justify-between gap-10"
        >
          {/* Left: headline */}
          <div className="max-w-xl">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-background/50 mb-5">
              Get started today
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-balance">
              Make your components stand out.
            </h2>
          </div>

          {/* Right: actions + note */}
          <div className="flex flex-col gap-4 items-start md:items-end flex-shrink-0">
            <div className="flex gap-3">
              <Link href="/editor/theme">
                <Button
                  size="lg"
                  className="h-11 px-6 rounded-sm text-sm font-medium bg-background text-foreground hover:bg-background/90"
                >
                  Try It Now
                  <ArrowRight className="ml-2 size-3.5" />
                </Button>
              </Link>
              <Link href="https://github.com/jnsahaj/tweakcn" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 px-6 rounded-sm text-sm font-medium border-background/20 text-background bg-transparent hover:bg-background/10"
                >
                  View on GitHub
                </Button>
              </Link>
            </div>
            <p className="text-xs text-background/50">
              No login required &nbsp;&middot;&nbsp; Free to use &nbsp;&middot;&nbsp; Open source
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
