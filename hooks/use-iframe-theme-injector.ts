import { useEditorStore } from "@/store/editor-store";
import { EmbedMessage, IframeStatus, MESSAGE } from "@/types/live-preview-embed";
import { applyThemeToElement } from "@/utils/apply-theme";
import { useCallback, useEffect, useRef, useState } from "react";

const THEME_UPDATE_DEBOUNCE_MS = 150; // Throttle theme updates to ~6-7 fps

export interface UseIframeThemeInjectorProps {
  allowCrossOrigin?: boolean; // default false - must explicitly opt-in for external sites
  iframeRef?: React.RefObject<HTMLIFrameElement | null>; // optional - hook provides one if not given
}

/**
 * Unified hook for iframe theme injection
 * Same-origin: Direct theme application (no validation needed)
 * Cross-origin: postMessage communication with validation
 */
export const useIframeThemeInjector = ({
  allowCrossOrigin = false,
  iframeRef,
}: UseIframeThemeInjectorProps = {}) => {
  const internalRef = useRef<HTMLIFrameElement | null>(null);
  const ref = iframeRef ?? internalRef;

  const { themeState } = useEditorStore();
  const [status, setStatus] = useState<IframeStatus>("unknown");
  const validationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const themeUpdateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applySameOriginTheme = useCallback(() => {
    if (allowCrossOrigin) return; // Only for same-origin mode

    const iframe = ref.current;
    if (!iframe?.contentDocument?.documentElement) return;

    const iframeRoot = iframe.contentDocument.documentElement;
    applyThemeToElement(themeState, iframeRoot);
  }, [allowCrossOrigin, ref, themeState]);

  const postMessage = useCallback(
    (msg: EmbedMessage) => {
      const iframe = ref.current;
      if (iframe?.contentWindow) {
        try {
          iframe.contentWindow.postMessage(msg, "*");
        } catch (error) {
          console.warn("Failed to send message to iframe:", error);
        }
      }
    },
    [ref]
  );

  const startCrossOriginValidation = useCallback(() => {
    setStatus("checking");
    postMessage({ type: MESSAGE.PING });

    clearTimeout(validationTimeoutRef.current!);
    validationTimeoutRef.current = setTimeout(() => {
      setStatus("missing");
    }, 2000);
  }, [postMessage]);

  // Listen for iframe load
  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) {
      setStatus("unknown");
      return;
    }

    const handleLoad = () => {
      if (allowCrossOrigin) {
        // Cross-origin: validate via postMessage
        startCrossOriginValidation();
      } else {
        // Same-origin: just apply theme directly
        applySameOriginTheme();
        setStatus("supported"); // Always supported for same-origin
      }
    };

    // Check immediately if already loaded
    if (iframe.src) handleLoad();

    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, [allowCrossOrigin, startCrossOriginValidation, applySameOriginTheme]);

  // Listen for cross-origin messages (only when needed)
  useEffect(() => {
    if (!allowCrossOrigin) return;

    const handleMessage = (event: MessageEvent<EmbedMessage>) => {
      const iframe = ref.current;
      if (!iframe || event.source !== iframe.contentWindow) return;

      const message = event.data;
      clearTimeout(validationTimeoutRef.current!);

      switch (message.type) {
        case MESSAGE.EMBED_LOADED:
        case MESSAGE.PONG:
          setStatus("connected");
          postMessage({ type: MESSAGE.CHECK_SHADCN });
          break;

        case MESSAGE.SHADCN_STATUS:
          setStatus(message.payload.supported ? "supported" : "unsupported");
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [allowCrossOrigin, ref, postMessage]);

  // Handle theme updates
  useEffect(() => {
    if (allowCrossOrigin) {
      // Cross-origin: debounced postMessage (only if supported)
      if (status === "supported") {
        clearTimeout(themeUpdateTimeoutRef.current!);
        themeUpdateTimeoutRef.current = setTimeout(() => {
          postMessage({ type: MESSAGE.THEME_UPDATE, payload: { themeState } });
        }, THEME_UPDATE_DEBOUNCE_MS);
      }
    } else {
      // Same-origin: immediate direct application
      applySameOriginTheme();
    }
  }, [themeState, allowCrossOrigin, status, applySameOriginTheme, postMessage]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearTimeout(validationTimeoutRef.current!);
      clearTimeout(themeUpdateTimeoutRef.current!);
    };
  }, []);

  return {
    ref,
    status: allowCrossOrigin ? status : "supported", // Same-origin is always "supported"
    retryValidation: allowCrossOrigin ? startCrossOriginValidation : applySameOriginTheme,
  };
};
