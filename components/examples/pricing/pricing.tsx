"use client";

import { ArrowRight, CircleCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: PricingFeature[];
  button: {
    text: string;
    url: string;
  };
}

interface Pricing2Props {
  heading?: string;
  description?: string;
  plans?: PricingPlan[];
}

const Pricing2 = ({
  heading = "Pricing",
  description = "Check out our affordable pricing plans",
  plans = [
    {
      id: "plus",
      name: "Plus",
      description: "For personal use",
      monthlyPrice: "$19",
      yearlyPrice: "$15",
      features: [
        { text: "Up to 5 team members" },
        { text: "Basic components library" },
        { text: "Community support" },
        { text: "1GB storage space" },
      ],
      button: {
        text: "Purchase",
        url: "https://www.shadcnblocks.com",
      },
    },
    {
      id: "pro",
      name: "Pro",
      description: "For professionals",
      monthlyPrice: "$49",
      yearlyPrice: "$35",
      features: [
        { text: "Unlimited team members" },
        { text: "Advanced components" },
        { text: "Priority support" },
        { text: "Unlimited storage" },
      ],
      button: {
        text: "Purchase",
        url: "https://www.shadcnblocks.com",
      },
    },
  ],
}: Pricing2Props) => {
  const [isYearly, setIsYearly] = useState(false);
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <h2 className="text-4xl font-bold text-pretty lg:text-6xl">{heading}</h2>
          <p className="text-muted-foreground lg:text-xl">{description}</p>
          <div className="flex items-center gap-3 text-lg">
            Monthly
            <Switch checked={isYearly} onCheckedChange={() => setIsYearly(!isYearly)} />
            Yearly
          </div>
          <div className="flex flex-col items-stretch gap-6 md:flex-row">
            {plans.map((plan) => (
              <Card key={plan.id} className="flex w-80 flex-col justify-between text-left">
                <CardHeader>
                  <CardTitle>
                    <p>{plan.name}</p>
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                  <span className="text-4xl font-bold">
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <p className="text-muted-foreground">
                    Billed{" "}
                    {isYearly
                      ? `$${Number(plan.yearlyPrice.slice(1)) * 12}`
                      : `$${Number(plan.monthlyPrice.slice(1)) * 12}`}{" "}
                    annually
                  </p>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  {plan.id === "pro" && (
                    <p className="mb-3 font-semibold">Everything in Plus, and:</p>
                  )}
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CircleCheck className="size-4" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild className="w-full">
                    <a href={plan.button.url} target="_blank">
                      {plan.button.text}
                      <ArrowRight className="ml-2 size-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing2;
