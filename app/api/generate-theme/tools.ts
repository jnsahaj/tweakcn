import { themeStylesOutputSchema } from "@/utils/ai/generate-theme";
import { MODELS, baseProviderOptions } from "@/utils/ai/providers";
import { streamObject, tool } from "ai";
import z from "zod";
import { Context } from "./route";

export const THEME_GENERATION_TOOLS = {
  generateTheme: tool({
    description: `Generate a complete shadcn/ui theme (light and dark) from the conversation context. Use this tool as soon as you've gathered sufficient input (prompt, images/SVG, or an @base theme reference). The input is the current conversation context.
    
    # Rules
    - Some tokens come with a -foreground counterpart, ensure adequate contrast for each base/foreground pair.
    - Colors must be HEX only (#RRGGBB). Do not output rgba().
    - Do not output CSS variables for fonts; use the font family string.`,
    inputSchema: z.object({}),
    outputSchema: themeStylesOutputSchema,
    execute: async (_input, { messages, abortSignal, toolCallId, experimental_context }) => {
      const { writer } = experimental_context as Context;

      const { partialObjectStream, object } = streamObject({
        abortSignal,
        model: MODELS.themeGeneration,
        providerOptions: baseProviderOptions,
        schema: themeStylesOutputSchema,
        messages,
      });

      for await (const chunk of partialObjectStream) {
        writer.write({
          id: toolCallId,
          type: "data-generated-theme-styles",
          data: { status: "streaming", themeStyles: chunk },
          transient: true,
        });
      }

      const themeStyles = await object;

      writer.write({
        id: toolCallId,
        type: "data-generated-theme-styles",
        data: { status: "ready", themeStyles },
        transient: true,
      });

      return themeStyles;
    },
  }),
};
