import { SectionHeading } from "@/components/examples/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

const metrics = [
  { label: "12,500+", subLabel: "Projects completed", action: "Our clients" },
  { label: "38% faster", subLabel: "Delivery across teams", action: "Learn more" },
  { label: "94%", subLabel: "User satisfaction", action: "See feedback" },
  { label: "8 zones", subLabel: "With active customers", action: "Our users" },
];

export function Metrics() {
  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-9 px-5 lg:grid-cols-2 lg:px-8">
        {/* Left column: section heading and metrics */}
        <div className="flex flex-col gap-12 self-center lg:gap-16">
          <SectionHeading
            align="left"
            title="Trusted by Teams Everywhere"
            body="Acme Inc. is helping thousands of creators and companies move faster, work smarter, and deliver with confidence."
          />

          <div className="grid gap-5 md:grid-cols-2 lg:gap-x-9 lg:gap-y-8">
            {metrics.map((metric) => (
              <div key={metric.label} className="flex flex-col items-start gap-y-0.5 border-l pl-6">
                <span className="text-3xl font-medium tracking-tight">{metric.label}</span>
                <span className="text-muted-foreground text-base text-pretty">
                  {metric.subLabel}
                </span>
                <Button variant="link" className="!px-0">
                  {metric.action} <ArrowRightIcon />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: image */}
        <div className="bg-muted relative aspect-square overflow-hidden rounded-xl">
          <img
            src="/examples/marketing/metrics.webp"
            alt="Team at work"
            className="size-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
