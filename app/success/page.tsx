import { Suspense } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

function SuccessContent() {
  return (
    <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <Card className="w-full max-w-lg border-0 shadow-2xl">
        <CardContent className="space-y-8 p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/20 blur-xl" />
              <div className="relative rounded-full bg-green-500/10 p-4">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-3">
            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Welcome to <span className="text-foreground font-semibold">tweakcn pro</span>! Your
              subscription is now active and you have access to all premium features.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
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
          </div>

          {/* Additional Info */}
          <div className="border-border border-t pt-4">
            <p className="text-muted-foreground text-sm">
              Need help?{" "}
              <Link href="mailto:sahaj@tweakcn.com" className="text-primary hover:underline">
                contact us
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
