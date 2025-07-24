import type { ThemeEditorState } from "@/types/editor";

// Keep in sync with public/live-preview-embed-script.js TWEAKCN_MESSAGE
export const MESSAGE = {
  PING: "TWEAKCN_PING",
  PONG: "TWEAKCN_PONG",
  CHECK_SHADCN: "TWEAKCN_CHECK_SHADCN",
  SHADCN_STATUS: "TWEAKCN_SHADCN_STATUS",
  THEME_UPDATE: "TWEAKCN_THEME_UPDATE",
  THEME_APPLIED: "TWEAKCN_THEME_APPLIED",
  EMBED_LOADED: "TWEAKCN_EMBED_LOADED",
} as const;

export type MessageType = (typeof MESSAGE)[keyof typeof MESSAGE];

export interface ShadcnStatusPayload {
  supported: boolean;
}

export interface ThemeUpdatePayload {
  themeState: ThemeEditorState;
}

export type EmbedMessage =
  | { type: typeof MESSAGE.PING }
  | { type: typeof MESSAGE.PONG }
  | { type: typeof MESSAGE.CHECK_SHADCN }
  | { type: typeof MESSAGE.SHADCN_STATUS; payload: ShadcnStatusPayload }
  | { type: typeof MESSAGE.THEME_UPDATE; payload: ThemeUpdatePayload }
  | { type: typeof MESSAGE.THEME_APPLIED }
  | { type: typeof MESSAGE.EMBED_LOADED };

export type IframeStatus =
  | "unknown"
  | "checking"
  | "connected"
  | "supported"
  | "unsupported"
  | "missing";
