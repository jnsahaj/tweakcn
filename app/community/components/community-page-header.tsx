"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle, Upload, Settings, Sparkles } from "lucide-react";
import Link from "next/link";

export function CommunityPageHeader() {
  return (
    <div className="mb-10 md:mb-14">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary size-5" />
            <span className="text-primary text-sm font-medium tracking-wide uppercase">
              Community
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
            Themes crafted by the community
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
            Discover beautiful shadcn/ui themes, like your favorites, and open
            them directly in the editor to make them your own.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <HelpCircle className="size-3.5" />
                How to publish
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Publish your theme</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Share your custom themes with the community in two easy steps:
                </p>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="bg-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      1
                    </span>
                    <span className="text-muted-foreground">
                      Save your theme in the editor by clicking the{" "}
                      <strong className="text-foreground">Save</strong> button
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      2
                    </span>
                    <span className="text-muted-foreground">
                      Click{" "}
                      <strong className="text-foreground">
                        <Upload className="mr-0.5 inline size-3" />
                        Publish
                      </strong>{" "}
                      after saving, or go to{" "}
                      <Link
                        href="/settings"
                        className="text-primary inline-flex items-center gap-0.5 font-medium underline underline-offset-2 hover:opacity-80"
                      >
                        <Settings className="inline size-3" />
                        Settings
                      </Link>{" "}
                      to publish any saved theme
                    </span>
                  </li>
                </ol>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
