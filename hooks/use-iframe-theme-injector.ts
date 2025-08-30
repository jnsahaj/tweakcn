import { useEditorStore } from "@/store/editor-store";
import { EmbedMessage, IframeStatus, MESSAGE } from "@/types/live-preview-embed";
import { applyThemeToElement } from "@/utils/apply-theme";
import { useCallback, useEffect, useRef, useState } from "react";

const THEME_UPDATE_DEBOUNCE_MS = 50;

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
  const [themeInjectionError, setThemeInjectionError] = useState<string | null>(null);
  const validationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const themeUpdateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applySameOriginTheme = useCallback(() => {
    if (allowCrossOrigin) return; // Only for same-origin mode

    const iframe = ref.current;
    const iframeRoot = iframe?.contentDocument?.documentElement;
    if (!iframeRoot) return;

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
          setThemeInjectionError("Failed to establish the connection.");
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
      setThemeInjectionError(
        "The tweakcn's live theme preview script could not be found. Please make sure the script is included in the website's source code and try again."
      );
    }, 3000);
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
        setThemeInjectionError(null);
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
          console.log("Tweakcn Embed: Embed loaded");
          setThemeInjectionError(null);
          break;

        case MESSAGE.PONG:
          setStatus("connected");
          setThemeInjectionError(null);
          postMessage({ type: MESSAGE.CHECK_SHADCN });
          break;

        case MESSAGE.SHADCN_STATUS:
          const { supported } = message.payload;
          if (supported) {
            setStatus("supported");
            setThemeInjectionError(null);
          } else {
            setStatus("unsupported");
            setThemeInjectionError(
              "Live theme preview requires shadcn/ui setup. Please make sure that the basic shadcn/ui variables are configured correctly."
            );
          }
          break;

        case MESSAGE.EMBED_ERROR:
          const { error } = message.payload;
          console.error("Tweakcn Embed: Error from iframe:", error);
          setStatus("error");
          setThemeInjectionError(error);
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
    themeInjectionError,
  };
};
