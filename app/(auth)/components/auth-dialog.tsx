"use client";

import Github from "@/assets/github.svg";
import Google from "@/assets/google.svg";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/revola";
import { PostLoginActionType } from "@/hooks/use-post-login-action";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: "signin" | "signup";
  trigger?: React.ReactNode; // Optional trigger element
  postLoginActionType?: PostLoginActionType | null;
}

// Get contextual copy based on the post-login action
function getContextualCopy(actionType?: PostLoginActionType | null) {
  switch (actionType) {
    case "SAVE_THEME":
      return {
        title: "Sign in to Save",
        description: "Sign in to save your theme and access it from anywhere",
      };
    case "SAVE_THEME_FOR_SHARE":
      return {
        title: "Sign in to Share",
        description: "Sign in to save and share your theme with others",
      };
    case "SAVE_THEME_FOR_V0":
      return {
        title: "Sign in to open in v0",
        description: "Sign in to save your theme and open it in v0",
      };
    case "SAVE_THEME_FOR_PLAYGROUND":
      return {
        title: "Sign in to open in Playground",
        description: "Sign in to save your theme and open it in shadcn playground",
      };
    case "AI_GENERATE_FROM_PAGE":
    case "AI_GENERATE_FROM_CHAT":
    case "AI_GENERATE_FROM_CHAT_SUGGESTION":
    case "AI_GENERATE_EDIT":
    case "AI_GENERATE_RETRY":
      return {
        title: "Sign in for AI",
        description: "Sign in to use AI-powered theme generation",
      };
    case "CHECKOUT":
      return {
        title: "Sign in to continue",
        description: "Sign in to complete your purchase",
      };
    default:
      return null;
  }
}

export function AuthDialog({
  open,
  onOpenChange,
  initialMode = "signin",
  trigger,
  postLoginActionType,
}: AuthDialogProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSignIn, setIsSignIn] = useState(initialMode === "signin");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const contextualCopy = getContextualCopy(postLoginActionType);

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
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <ResponsiveDialogTrigger asChild>{trigger}</ResponsiveDialogTrigger>}
      <ResponsiveDialogContent className="overflow-hidden sm:max-w-100">
        <div className="space-y-4">
          <ResponsiveDialogHeader className="sm:pt-8">
            <ResponsiveDialogTitle className="text-center text-2xl font-bold">
              {contextualCopy?.title ?? (isSignIn ? "Welcome back" : "Create account")}
            </ResponsiveDialogTitle>
            <p className="text-muted-foreground text-center">
              {contextualCopy?.description ??
                (isSignIn
                  ? "Sign in to your account to continue"
                  : "Sign up to get started with tweakcn")}
            </p>
          </ResponsiveDialogHeader>

          <div className="space-y-6 p-6 pt-2">
            <div className="space-y-3">
              <Button
                size="lg"
                variant="outline"
                onClick={handleGoogleSignIn}
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
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
