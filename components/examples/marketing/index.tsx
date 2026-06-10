import { Benefits } from "@/components/examples/marketing/benefits";
import { Hero } from "@/components/examples/marketing/hero";
import { Metrics } from "@/components/examples/marketing/metrics";
import { Pricing } from "@/components/examples/marketing/pricing";
import { Testimonials } from "@/components/examples/marketing/testimonials";

export default function MarketingDemo() {
  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-7xl px-5 pt-4 lg:px-8">
        <p className="text-muted-foreground text-xs">
          Marketing blocks from{" "}
          <a
            href="https://shadcncraft.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground underline underline-offset-4"
          >
            shadcncraft Pro
          </a>
        </p>
      </div>

      <Hero />
      <Benefits />
      <Metrics />
      <Pricing />
      <Testimonials />
    </div>
  );
}
