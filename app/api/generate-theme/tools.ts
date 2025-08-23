import { themeStylesOutputSchema } from "@/utils/ai/generate-theme";
import { baseModel, baseProviderOptions } from "@/utils/ai/model";
import { generateObject, tool } from "ai";
import z from "zod";
import { Context } from "./route";

export const THEME_GENERATION_TOOLS = {
  generateTheme: tool({
    description: `Generate a complete shadcn/ui theme (light and dark) from the conversation context. Use this tool as soon as you've gathered sufficient input (prompt, images/SVG, or an @base theme reference). The input is the current conversation context.`,
    inputSchema: z.object({}),
    outputSchema: themeStylesOutputSchema,
    execute: async (_input, { messages, abortSignal, toolCallId, experimental_context }) => {
      const { writer } = experimental_context as Context;

      const { object: themeStyles } = await generateObject({
        abortSignal,
        model: baseModel,
        schema: themeStylesOutputSchema,
        messages,
        providerOptions: baseProviderOptions,
      });

      writer.write({
        id: toolCallId,
        type: "data-generated-theme-styles",
        data: { themeStyles },
        transient: true,
      });

      return themeStyles;
    },
  }),
};
