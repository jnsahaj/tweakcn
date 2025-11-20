"use client";

import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";
import { Gem } from "lucide-react";
import Link from "next/link";

interface GetProCTAProps extends React.ComponentProps<typeof Button> {}

export function GetProCTA({ className, ...props }: GetProCTAProps) {
  const { subscriptionStatus, isPending } = useSubscription();
  const isPro = subscriptionStatus?.isSubscribed ?? false;

  if (isPending || isPro) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        "text-primary animate-in fade-in-50 bg-primary/10 hover:bg-primary hover:text-primary-foreground shadow-none duration-300",
        className
      )}
      asChild
      {...props}
    >
      <Link href="/pricing">
        <Gem />
        <span className="hidden lg:block">Get Pro</span>
      </Link>
    </Button>
  );
}
