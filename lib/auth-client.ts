"use client";

import { createAuthClient } from "better-auth/react";
import { polar } from "./polar";

export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL,
});
