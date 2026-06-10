"use client";

import { SectionHeading } from "@/components/examples/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { BuildingIcon, CircleCheckIcon, StarIcon, ZapIcon, type LucideIcon } from "lucide-react";
import { useState } from "react";

type BillingPeriod = "yearly" | "monthly";

type Plan = {
  icon: LucideIcon;
  title: string;
  description: string;
  amounts: Record<BillingPeriod, number>;
  features: string[];
  mostPopular?: boolean;
  buttonVariant?: "default" | "outline";
};

const plans: Plan[] = [
  {
    icon: StarIcon,
    title: "Starter",
    description: "For individuals who want AI assistance in their daily workflow.",
    amounts: { yearly: 10, monthly: 15 },
    features: [
      "Unlimited projects",
      "AI-powered insights",
      "Seamless integrations",
      "Community support",
    ],
    buttonVariant: "outline",
  },
  {
    icon: ZapIcon,
    title: "Pro",
    description: "For fast-moving teams that want to collaborate in real time.",
    amounts: { yearly: 24, monthly: 32 },
    features: [
      "Everything in Starter",
      "Real-time collaboration",
      "Advanced reporting",
      "Priority support",
    ],
    mostPopular: true,
  },
  {
    icon: BuildingIcon,
    title: "Enterprise",
    description: "For organizations that need security, control, and support at scale.",
    amounts: { yearly: 48, monthly: 60 },
    features: [
      "Everything in Pro",
      "SSO & audit logs",
      "Dedicated success manager",
      "Custom integrations",
    ],
    buttonVariant: "outline",
  },
];

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("yearly");

  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 lg:gap-16 lg:px-8">
        <div className="flex flex-col gap-5">
          <SectionHeading
            tagline="Pricing"
            title="Simple Pricing, Smarter Work"
            body="Acme Inc. has a plan designed to help you move faster."
          />

          <Tabs
            className="w-full"
            value={billingPeriod}
            onValueChange={(value) => setBillingPeriod(value as BillingPeriod)}
          >
            <TabsList className="mx-auto w-full sm:w-fit">
              <TabsTrigger value="yearly">Billed yearly</TabsTrigger>
              <TabsTrigger value="monthly">Billed monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid items-stretch gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.title} plan={plan} billingPeriod={billingPeriod} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ plan, billingPeriod }: { plan: Plan; billingPeriod: BillingPeriod }) {
  return (
    <Card className={cn("w-full", plan.mostPopular && "border-primary border-2")}>
      <CardHeader>
        <div className="bg-muted flex size-12 shrink-0 items-center justify-center rounded-md border">
          <plan.icon className="text-primary size-4" />
        </div>
        {plan.mostPopular && (
          <CardAction>
            <Badge>Most Popular</Badge>
          </CardAction>
        )}
      </CardHeader>

      <CardContent>
        <CardTitle className="text-lg">{plan.title}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardContent>

      <CardContent className="mt-auto flex gap-2">
        <span className="self-end text-5xl font-medium tracking-tight tabular-nums">
          ${plan.amounts[billingPeriod]}
        </span>
        <div className="flex flex-col self-end">
          <span className="text-sm font-medium">Per month</span>
          <span className="text-muted-foreground text-sm">Plus local taxes</span>
        </div>
      </CardContent>

      <CardContent>
        <Button variant={plan.buttonVariant ?? "default"} size="lg" className="w-full">
          Get started
        </Button>
      </CardContent>

      <CardContent className="flex flex-col items-stretch gap-3">
        {plan.features.map((feature) => (
          <div key={feature} className="flex gap-1.5">
            <CircleCheckIcon className="text-muted-foreground mt-1 size-4 shrink-0" />
            <span className="flex-1 text-base">{feature}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
