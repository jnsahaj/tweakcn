import { SectionHeading } from "@/components/examples/marketing/section-heading";
import { ImageIcon } from "lucide-react";

const benefits = [
  {
    title: "Intelligent Prioritization",
    body: "Know exactly what to work on next with AI that understands your goals and context. Prioritize smarter with Acme Inc.",
  },
  {
    title: "Effortless Integration",
    body: "Acme Inc. connects seamlessly with the tools your team already uses, so there's no steep learning curve or disruption.",
  },
  {
    title: "Clear Decision Support",
    body: "When projects stall, it's rarely because of lack of effort, it's lack of clarity. Acme Inc. provides AI-driven insights.",
  },
];

export function Benefits() {
  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 lg:gap-16 lg:px-8">
        <SectionHeading
          tagline="Benefits"
          title="AI That Works Your Way"
          body="Acme Inc. eliminates the work and gives you a clear picture of what matters."
        />

        <div className="bg-border grid w-full grid-cols-1 gap-px overflow-hidden rounded-xl border shadow-sm md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
          {benefits.map((benefit) => (
            // Even cards order their children in reverse on screens > md
            <div
              key={benefit.title}
              className="bg-background flex flex-col gap-5 p-5 md:even:flex-col-reverse"
            >
              <div className="bg-muted flex aspect-square size-full items-center justify-center overflow-hidden rounded-lg">
                <ImageIcon className="text-muted-foreground/40 size-10" />
              </div>

              <div className="flex max-w-xl flex-col gap-1 text-left">
                <h3 className="text-xl font-medium tracking-tight text-balance">{benefit.title}</h3>
                <p className="text-muted-foreground text-lg text-pretty">{benefit.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
