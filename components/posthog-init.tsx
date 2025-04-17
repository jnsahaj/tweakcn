"use client";

import { useEffect } from "react";
import { initPostHog } from "@/lib/posthog";

export function PostHogInit() {
  useEffect(() => {
    initPostHog();
  }, []);

  return null;
}
