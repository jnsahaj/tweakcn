import { SectionHeading } from "@/components/examples/marketing/section-heading";
import {
  ArrowBigUpDashIcon,
  ChartSplineIcon,
  DatabaseIcon,
  IterationCcwIcon,
  UsersIcon,
  WorkflowIcon,
  type LucideIcon,
} from "lucide-react";

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ArrowBigUpDashIcon,
    title: "Intelligent Prioritization",
    description:
      "Know exactly what to work on next with AI that understands your goals and context.",
  },
  {
    icon: IterationCcwIcon,
    title: "Effortless Integration",
    description:
      "Acme Inc. connects seamlessly with the tools your team already uses, so there's no steep learning curve.",
  },
  {
    icon: DatabaseIcon,
    title: "Clear Decision Support",
    description:
      "When projects stall, it's rarely lack of effort, it's lack of clarity. Get AI-driven insights.",
  },
  {
    icon: ChartSplineIcon,
    title: "Smarter Analytics",
    description:
      "Turn data into clarity with AI-powered insights that help you act faster and more confidently.",
  },
  {
    icon: WorkflowIcon,
    title: "Seamless Workflow",
    description: "Stay in the zone without constant context switching across apps and tools.",
  },
  {
    icon: UsersIcon,
    title: "Team Alignment",
    description:
      "Keep everyone on the same page with a single source of truth for projects and decisions.",
  },
];

export function Benefits() {
  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 lg:gap-16 lg:px-8">
        <SectionHeading
          tagline="Benefits"
          title="AI That Works Your Way"
          body="Acme Inc. eliminates the busywork and gives you a clear picture of what matters."
        />

        <div className="grid justify-center gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-9">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex max-w-xl flex-col items-center gap-4 text-center"
            >
              <div className="bg-muted flex size-16 shrink-0 items-center justify-center rounded-lg border">
                <feature.icon className="text-primary size-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-medium tracking-tight text-balance">{feature.title}</h3>
                <p className="text-muted-foreground text-lg text-pretty">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
