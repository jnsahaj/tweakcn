import "server-only";

import { createGoogleGenerativeAI, GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const MODELS = {
  basic: google("gemini-2.5-flash"),
  themeGeneration: google("gemini-2.5-pro"),
  promptEnhancement: google("gemini-2.5-flash"),
};

export const baseProviderOptions = {
  google: {
    thinkingConfig: {
      includeThoughts: false,
      thinkingBudget: 128,
    },
  } satisfies GoogleGenerativeAIProviderOptions,
};
