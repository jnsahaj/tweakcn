import { SectionHeading } from "@/components/examples/marketing/section-heading";
import { Separator } from "@/components/ui/separator";
import { ActivityIcon, DatabaseIcon, UsersIcon, WorkflowIcon, type LucideIcon } from "lucide-react";

const subFeatures: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ActivityIcon,
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
  {
    icon: DatabaseIcon,
    title: "Clear Decision Support",
    description:
      "When projects stall, it's rarely because of lack of effort, it's lack of clarity. Acme Inc. provides AI-driven insights.",
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

        {/* Benefits */}
        <div className="grid w-full gap-5 md:grid-cols-[1fr_auto_1fr] md:border-b lg:gap-9">
          <BenefitCard
            title="Intelligent Prioritization"
            body="Know exactly what to work on next with AI that understands your goals and context. Prioritize smarter with Acme Inc."
            image="/examples/marketing/benefit-1.webp"
          />

          <Separator orientation="vertical" className="hidden h-full md:block" />
          <Separator className="w-full md:hidden" />

          <BenefitCard
            title="Effortless Integration"
            body="Acme Inc. connects seamlessly with the tools your team already uses, so there's no steep learning curve or disruption."
            image="/examples/marketing/benefit-2.webp"
          />
        </div>

        {/* Sub features */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-9">
          {subFeatures.map((feature) => (
            <div key={feature.title} className="flex max-w-xl flex-col gap-3">
              <h3 className="flex items-center gap-2 text-lg font-medium tracking-tight text-balance">
                <feature.icon className="size-6 shrink-0" />
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-base text-pretty">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ title, body, image }: { title: string; body: string; image: string }) {
  return (
    <div className="@container/benefit-card">
      <div className="flex flex-col gap-5 py-5 lg:py-9 @xl/benefit-card:gap-6">
        <div className="flex flex-1 flex-col gap-1.5">
          <h3 className="text-3xl font-medium tracking-tight">{title}</h3>
          <p className="text-muted-foreground text-lg">{body}</p>
        </div>

        <div className="bg-muted relative aspect-square size-full overflow-hidden rounded-lg">
          <img src={image} className="size-full object-cover" alt={title} />
        </div>
      </div>
    </div>
  );
}
