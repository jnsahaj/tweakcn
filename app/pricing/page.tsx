"use client";

import { NoiseEffect } from "@/components/effects/noise-effect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar, Check, Circle, Mail } from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "./components/checkout-button";

type Feature = {
  description: string;
  status: "done" | "pending";
};

const FREE_FEATURES: Feature[] = [
  { description: "Full theme customization", status: "done" },
  { description: "5 AI generated themes", status: "done" },
  { description: "Save and share up to 10 themes", status: "done" },
  { description: "Import theme using CSS variables", status: "done" },
  { description: "Export theme via CSS variables", status: "done" },
  { description: "Export theme via Shadcn Registry Command", status: "done" },
  { description: "Contrast checker", status: "done" },
];

const PRO_FEATURES: Feature[] = [
  { description: "Save and share unlimited themes", status: "done" },
  { description: "Unlimited AI generated themes", status: "done" },
  { description: "Generate beautiful themes from images", status: "done" },
  { description: "Priority support", status: "done" },
  { description: "Save your own fonts and colors", status: "pending" },
];

export default function PricingPage() {
  return (
    <div className="from-background via-background to-muted/20 relative isolate min-h-screen bg-gradient-to-br">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 absolute top-0 right-0 size-80 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
        <div className="bg-secondary/10 absolute bottom-0 left-0 size-80 -translate-x-1/2 translate-y-1/2 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto space-y-16 px-4 py-20 md:px-6">
        {/* Header Section */}
        <div className="space-y-2 text-center">
          <h1 className="from-foreground to-foreground/50 bg-gradient-to-r bg-clip-text text-5xl font-bold tracking-tight text-pretty text-transparent md:text-6xl">
            Choose your perfect plan
          </h1>
          <p className="text-muted-foreground mx-auto max-w-3xl text-base text-balance md:text-lg">
            Start building beautiful themes for free. Upgrade to Pro when you&apos;re ready.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:gap-12">
          {/* Free Plan */}
          <Card className="group relative flex flex-col overflow-hidden border-2 transition-all duration-300">
            <CardHeader className="space-y-2 border-b">
              <div className="flex items-center gap-3">
                <CardTitle className="text-4xl font-medium">Free</CardTitle>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold tracking-tight lg:text-5xl">$0</span>
                <span className="text-muted-foreground text-lg">/month</span>
              </div>
              <p className="text-muted-foreground text-sm">No credit card required</p>
            </CardHeader>
            <CardContent className="flex-1 pt-6">
              <ul className="space-y-3">
                {FREE_FEATURES.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-primary/15 flex items-center justify-center rounded-full p-1">
                      {feature.status === "done" ? (
                        <Check className="text-primary size-3 stroke-2" />
                      ) : (
                        <Circle className="text-muted-foreground size-3 stroke-2" />
                      )}
                    </div>
                    <span className="text-sm">{feature.description}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant="outline"
                className="hover:bg-muted/50 h-12 w-full text-base font-medium transition-all duration-200"
                size="lg"
              >
                <Link href="/editor/theme">Get Started Free</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="group ring-primary/50 from-card to-primary/5 relative border-2 bg-gradient-to-b ring-2 transition-all duration-300">
            <div className="relative flex h-full flex-col">
              <CardHeader className="relative space-y-2 border-b">
                <NoiseEffect />

                <div className="flex items-center gap-3">
                  <CardTitle className="text-4xl font-medium">Pro</CardTitle>
                </div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight lg:text-5xl">$8</span>
                  <span className="text-muted-foreground text-lg">/month</span>
                </div>
                <p className="text-muted-foreground text-sm">Billed monthly • Cancel anytime</p>
              </CardHeader>
              <CardContent className="flex-1 pt-6">
                <p className="text-muted-foreground mb-4 text-sm font-medium">
                  Everything in Free, plus:
                </p>
                <ul className="space-y-3">
                  {PRO_FEATURES.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-full p-1",
                          feature.status === "done" ? "bg-primary/15" : "bg-muted-foreground/25"
                        )}
                      >
                        {feature.status === "done" ? (
                          <Check className="text-primary size-3 stroke-2" />
                        ) : (
                          <Calendar className="text-muted-foreground size-3 stroke-2" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          feature.status === "done" ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {feature.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <CheckoutButton />
              </CardFooter>
            </div>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="text-center">
          <div className="mx-auto max-w-2xl space-y-2">
            <p className="text-muted-foreground text-pretty">
              Need something custom or have questions?
            </p>
            <Link href="mailto:sahaj@tweakcn.com">
              <Button variant="link">
                <Mail className="size-4" />
                Get in touch
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
