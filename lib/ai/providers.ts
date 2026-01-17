import "server-only";

import { createGoogleGenerativeAI, GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { customProvider } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const baseProviderOptions = {
  google: {
    thinkingConfig: {
      includeThoughts: false,
      thinkingBudget: 128,
    },
  } satisfies GoogleGenerativeAIProviderOptions,
};

export const myProvider = customProvider({
  languageModels: {
    base: google("gemini-2.5-flash"),
    "theme-generation": google("gemini-3-flash-preview"),
    "prompt-enhancement": google("gemini-2.5-flash"),
  },
});
