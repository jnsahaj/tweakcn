import { Button } from "@/components/ui/button";
import { CheckIcon, ImageIcon } from "lucide-react";

const benefits = [
  "Finish projects faster",
  "Cut context switching with AI",
  "Make clear decisions with data",
];

export function Hero() {
  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="flex flex-col justify-center gap-5 lg:gap-9">
          <div className="flex max-w-3xl flex-col items-start gap-4 text-left">
            <h1 className="text-4xl font-medium tracking-tight text-balance lg:text-6xl">
              Make Better Decisions, With Ease
            </h1>
            <p className="text-muted-foreground max-w-xl text-lg text-pretty">
              Acme Inc&apos;s personal AI helps you cut through the noise, speed up delivery, and
              stay focused without switching contexts.
            </p>

            <ul className="space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex gap-2">
                  <CheckIcon className="mt-1 size-6 shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex w-full flex-col gap-2 pt-1 sm:w-fit sm:flex-row">
              <Button>Get Started</Button>
              <Button variant="outline">Preview</Button>
            </div>
          </div>
        </div>

        <div className="bg-muted flex aspect-5/4 size-full items-center justify-center overflow-hidden rounded-xl border md:order-first">
          <ImageIcon className="text-muted-foreground/40 size-10" />
        </div>
      </div>
    </section>
  );
}
