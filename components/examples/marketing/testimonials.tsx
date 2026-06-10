import { SectionHeading } from "@/components/examples/marketing/section-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    quote: "Acme completely changed how we handle client projects. We've cut manual tasks by half!",
    name: "Robert Johnson",
    role: "CEO - Flowpoint",
    avatar: "/avatars/02.png",
  },
  {
    quote:
      "We've eliminated 70% of manual reminders. Payments now come in predictably and we're really happy.",
    name: "Olivia Bennett",
    role: "Operations Manager - LumaTech",
    avatar: "/avatars/03.png",
  },
  {
    quote:
      "We scaled fast, and Acme kept up effortlessly, couldn't recommend enough. Finally a good platform!",
    name: "Daniel Brooks",
    role: "Head of Sales - NovaEdge",
    avatar: "/avatars/04.png",
  },
  {
    quote:
      "Real-time cashflow forecasting helped us avoid taking on unnecessary credit. The team is satisfied!",
    name: "Ethan Cooper",
    role: "COO - Brightwave",
    avatar: "/avatars/05.png",
  },
  {
    quote:
      "One platform for everything. No more switching between tools. Saved money and time instantly.",
    name: "Ryan Mitchell",
    role: "CEO - VectorWorks",
    avatar: "/avatars/01.png",
  },
  {
    quote:
      "Our onboarding used to take days. With Acme it's down to a few hours - and the experience is 10x smoother.",
    name: "Chloe Adams",
    role: "Marketing Lead - BlueOrbit",
    avatar: "/avatars/03.png",
  },
];

export function Testimonials() {
  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 lg:gap-16 lg:px-8">
        <SectionHeading align="left" title="Loved by talented teams" />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="bg-secondary gap-10 p-8 shadow-none">
              <blockquote className="text-secondary-foreground text-base font-medium text-pretty">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="mt-auto flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-secondary-foreground text-sm font-medium">
                    {testimonial.name}
                  </span>
                  <span className="text-muted-foreground text-xs">{testimonial.role}</span>
                </div>
                <Avatar>
                  <AvatarImage
                    src={testimonial.avatar}
                    alt={`${testimonial.name}'s avatar`}
                    className="object-cover"
                  />
                  <AvatarFallback className="uppercase">
                    {testimonial.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
