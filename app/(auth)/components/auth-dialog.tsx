"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import Google from "@/assets/google.svg";
import Github from "@/assets/github.svg";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: "signin" | "signup";
  trigger?: React.ReactNode; // Optional trigger element
}

export function AuthDialog({
  open,
  onOpenChange,
  initialMode = "signin",
  trigger,
}: AuthDialogProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSignIn, setIsSignIn] = useState(initialMode === "signin");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const getCallbackUrl = () => {
    const baseUrl = pathname || "/editor/theme";
    const queryString = searchParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  useEffect(() => {
    if (open) {
      setIsSignIn(initialMode === "signin");
    }
  }, [open, initialMode]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: getCallbackUrl(),
      });
    } catch (error) {
      console.error("Google Sign In Error:", error);
      // Handle error appropriately (e.g., show a toast notification)
    }
  };

  const handleGithubSignIn = async () => {
    setIsGithubLoading(true);
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: getCallbackUrl(),
      });
    } catch (error) {
      console.error("GitHub Sign In Error:", error);
      // Handle error appropriately
    }
  };

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="overflow-hidden rounded-2xl border-none p-0 sm:max-w-[400px]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            {isSignIn ? "Welcome back" : "Create account"}
          </DialogTitle>
          <p className="text-muted-foreground text-center">
            {isSignIn
              ? "Sign in to your account to continue"
              : "Sign up to get started with tweakcn"}
          </p>
        </DialogHeader>

        <div className="space-y-6 p-6 pt-2">
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              size="lg"
              className="hover:bg-primary/10 hover:text-foreground flex w-full items-center justify-center gap-2"
              disabled={isGoogleLoading || isGithubLoading}
            >
              <Google className="h-5 w-5" />
              <span className="font-medium">Continue with Google</span>
              {isGoogleLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </Button>

            <Button
              variant="outline"
              onClick={handleGithubSignIn}
              size="lg"
              className="hover:bg-primary/10 hover:text-foreground flex w-full items-center justify-center gap-2"
              disabled={isGoogleLoading || isGithubLoading}
            >
              <Github className="h-5 w-5" />
              <span className="font-medium">Continue with GitHub</span>
              {isGithubLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </Button>
          </div>

          <div className="pt-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-muted text-muted-foreground px-2">
                  {isSignIn ? "New to tweakcn?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={toggleMode}
                className="text-primary focus:ring-primary text-sm font-medium hover:underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                {isSignIn ? "Create an account" : "Sign in to your account"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
