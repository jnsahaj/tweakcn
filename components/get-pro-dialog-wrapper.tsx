"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useGetProDialogStore } from "@/store/get-pro-dialog-store";
import { PRO_SUB_FEATURES } from "@/utils/subscription";
import { Calendar, Check } from "lucide-react";
import Link from "next/link";
import { NoiseEffect } from "./effects/noise-effect";
import { AIChatDemo } from "./examples/ai-chat-demo";

export function GetProDialogWrapper() {
  const { isOpen, closeGetProDialog } = useGetProDialogStore();

  return <GetProDialog isOpen={isOpen} onClose={closeGetProDialog} />;
}

interface GetProDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function GetProDialog({ isOpen, onClose }: GetProDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="gap-0 overflow-hidden rounded-lg border p-0 md:max-w-2xl lg:max-w-4xl">
        <div className="flex flex-col md:flex-row">
          {/* Left section: content */}
          <section className="w-full space-y-8 border-r md:w-2/3 lg:w-1/2">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Get Pro</DialogTitle>
              <DialogDescription>{`Unlock all of tweakcn's features`}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 px-6">
              <ul className="space-y-3">
                {PRO_SUB_FEATURES.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-full p-1",
                        feature.status === "done" ? "bg-primary/15" : "bg-muted"
                      )}
                    >
                      {feature.status === "done" ? (
                        <Check className="text-primary size-3 stroke-2" />
                      ) : (
                        <Calendar className="text-muted-foreground size-3 stroke-2" />
                      )}
                    </div>
                    <span className={cn("text-sm", feature.status === "done" ? "" : "opacity-60")}>
                      {feature.description}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="text-muted-foreground text-sm">{`Don't worry, full theme customization is still yours, for free. Upgrade to Pro to take it
  to the next level, cancel anytime.`}</p>
            </div>

            <DialogFooter className="bg-muted/30 relative border-t p-6">
              <div className="flex w-full items-center justify-end gap-2">
                <Button asChild className="grow">
                  <Link href="/pricing" onNavigate={onClose}>
                    Upgrade to Pro
                  </Link>
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Maybe Later
                </Button>
              </div>
            </DialogFooter>
          </section>

          {/* Right section: chat preview, only visible md+ */}
          <section className="bg-muted/30 relative isolate hidden shrink-0 items-center justify-center overflow-hidden md:block md:w-1/3 lg:w-1/2">
            {/* ----Background effects---- */}
            <div
              className={cn(
                "absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(from_var(--primary)_r_g_b_/_0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(from_var(--primary)_r_g_b_/_0.25)_1px,transparent_1px)] bg-[size:2rem_2rem]",
                "mask-r-from-80% mask-b-from-80% mask-radial-from-70% mask-radial-to-85%"
              )}
            />

            <NoiseEffect />
            <div
              className={cn(
                "absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(from_var(--muted-foreground)_r_g_b_/_0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(from_var(--muted-foreground)_r_g_b_/_0.025)_1px,transparent_1px)] bg-[size:2rem_2rem]"
              )}
            />
            <div className="bg-foreground/10 absolute top-0 left-0 -z-10 size-35 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full blur-3xl" />
            <div className="bg-primary/15 absolute right-0 bottom-0 -z-10 size-70 translate-x-1/2 translate-y-1/2 rounded-full blur-3xl" />
            {/* ----Background effects---- */}

            <div className="absolute top-6 left-6 z-10 flex items-center justify-center overflow-hidden rounded-lg border lg:inset-6">
              <AIChatDemo />
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
