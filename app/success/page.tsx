import { NoiseEffect } from "@/components/effects/noise-effect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <Card className="w-full max-w-lg overflow-hidden border-0 shadow-2xl">
        <CardHeader className="relative flex flex-col items-center space-y-4">
          {/* Success Icon */}
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/20 blur-xl" />
            <div className="relative rounded-full bg-green-500/10 p-4">
              <CheckCircle className="size-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <CardTitle>
            <h1 className="text-foreground text-xl font-bold tracking-tight md:text-3xl">
              Payment Successful!
            </h1>
          </CardTitle>
          <CardDescription>
            <p className="text-muted-foreground text-center text-base text-pretty md:text-lg">
              Welcome to <span className="text-foreground font-semibold">tweakcn Pro</span>! Your
              subscription is now active and you have access to all premium features.
            </p>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <Button asChild size="lg" className="group w-full">
            <Link href="/editor/theme" className="flex items-center justify-center gap-2">
              Continue Editing
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline" className="group w-full">
            <Link href="/settings">
              Go to Settings
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardContent>

        <CardFooter className="relative border-t pt-6">
          <NoiseEffect />
          <p className="text-muted-foreground w-full text-center text-sm">
            Need help?{" "}
            <Link href="mailto:sahaj@tweakcn.com" className="text-primary hover:underline">
              Contact us
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
