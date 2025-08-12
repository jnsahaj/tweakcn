import "server-only";

import { createGoogleGenerativeAI, GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const baseModel = google("gemini-2.5-pro");

export const baseProviderOptions = {
  google: {
    thinkingConfig: {
      includeThoughts: false,
      thinkingBudget: 128,
    },
  } satisfies GoogleGenerativeAIProviderOptions,
};
