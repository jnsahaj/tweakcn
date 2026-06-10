import { LogoMark2 } from "@/components/examples/marketing/logo-strip";
import { MessageSquareQuoteIcon, StarIcon } from "lucide-react";

const testimonials = [
  { name: "Alex Morgan", role: "Product Manager", image: "/examples/avatars/person-2.webp" },
  { name: "Sophie Tan", role: "UX Researcher", image: "/examples/avatars/person-1.webp" },
  { name: "Emily Carter", role: "Product Manager", image: "/examples/avatars/person-3.webp" },
  { name: "Hannah Lee", role: "Software Engineer", image: "/examples/avatars/person-6.webp" },
];

export function Testimonials() {
  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 lg:gap-16 lg:px-8">
        {/* Section heading, logo, and testimonial quote */}
        <div className="flex flex-col">
          <div className="text-muted-foreground flex items-center gap-1.5 pb-3">
            <MessageSquareQuoteIcon className="size-6" />
            <span className="text-lg">Loved by talented teams...</span>
          </div>

          <div className="flex flex-col gap-9 md:flex-row">
            <blockquote className="text-3xl tracking-tight text-balance lg:text-4xl">
              Our team at Logoipsum has seen a huge boost in productivity since adopting Acme Inc.
              Designers, developers, and PMs are all working more seamlessly together.
            </blockquote>
            <div className="flex h-fit shrink-0 items-center gap-2">
              <LogoMark2 className="size-10" />
              <span className="text-2xl font-medium tracking-tight">Logoipsum</span>
            </div>
          </div>

          <span className="text-muted-foreground text-lg md:pt-3">June, 2025</span>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-muted relative isolate flex aspect-3/4 items-end overflow-hidden rounded-lg p-3 lg:p-5"
            >
              <img
                src={testimonial.image}
                alt={`${testimonial.name} - ${testimonial.role}`}
                className="absolute inset-0 z-0 size-full object-cover object-top"
              />

              <div className="bg-background/80 z-10 w-full rounded-xl border p-4 backdrop-blur-sm">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarIcon key={index} className="size-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-medium lg:text-lg">{testimonial.name}</span>
                  <span className="text-muted-foreground text-xs lg:text-sm">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
