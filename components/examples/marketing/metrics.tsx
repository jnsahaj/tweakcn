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
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 lg:gap-16 lg:px-8">
        <SectionHeading
          title="Trusted by Teams Everywhere"
          body="Acme Inc. is helping thousands of creators and companies move faster."
        />

        <div className="grid justify-center gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-9">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col items-center gap-y-1.5 text-center">
              <span className="text-3xl font-medium tracking-tight">{metric.label}</span>
              <span className="text-muted-foreground text-base text-pretty">{metric.subLabel}</span>
              <Button variant="link" className="!px-0">
                {metric.action} <ArrowRightIcon />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
