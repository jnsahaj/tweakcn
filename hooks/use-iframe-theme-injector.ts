import { useEditorStore } from "@/store/editor-store";
import { useCallback, useEffect, useRef, useState } from "react";

export type IframeStatus =
  | "unknown"
  | "checking"
  | "connected"
  | "supported"
  | "unsupported"
  | "missing";

export const useIframeThemeInjector = (iframeId: string, isReady: boolean) => {
  const { themeState } = useEditorStore();
  const [status, setStatus] = useState<IframeStatus>("unknown");
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getIframe = useCallback(
    () => document.getElementById(iframeId) as HTMLIFrameElement,
    [iframeId]
  );

  const sendMessage = useCallback(
    (type: string, payload?: any) => {
      const iframe = getIframe();
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type, payload }, "*");
      }
    },
    [getIframe]
  );

  const startValidation = useCallback(() => {
    setStatus("checking");
    sendMessage("TWEAKCN_PING");

    clearTimeout(validationTimeoutRef.current!);
    validationTimeoutRef.current = setTimeout(() => {
      setStatus("missing");
    }, 2000);
  }, [sendMessage]);

  useEffect(() => {
    if (isReady) {
      startValidation();
    }
  }, [isReady, startValidation]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const iframe = getIframe();
      if (!iframe || event.source !== iframe.contentWindow) return;

      const { type, payload } = event.data;

      clearTimeout(validationTimeoutRef.current!);

      switch (type) {
        case "TWEAKCN_EMBED_LOADED":
        case "TWEAKCN_PONG":
          setStatus("connected");
          sendMessage("TWEAKCN_CHECK_SHADCN");
          break;

        case "TWEAKCN_SHADCN_STATUS":
          setStatus(payload.supported ? "supported" : "unsupported");
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [getIframe, sendMessage]);

  useEffect(() => {
    if (status === "supported") {
      sendMessage("TWEAKCN_THEME_UPDATE", { themeState });
    }
  }, [themeState, status, sendMessage]);

  return { status, retryValidation: startValidation };
};
