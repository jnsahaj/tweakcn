"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
});
