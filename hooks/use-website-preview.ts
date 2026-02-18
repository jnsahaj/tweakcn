import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useQueryState } from "nuqs";
import { useWebsitePreviewStore } from "@/store/website-preview-store";

const LOADING_TIMEOUT_MS = 5000;

interface WebsitePreviewState {
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_LOAD_SUCCESS" }
  | { type: "SET_LOAD_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "RESET" };

const initialState: WebsitePreviewState = {
  isLoading: false,
  error: null,
};

function reducer(state: WebsitePreviewState, action: Action): WebsitePreviewState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_LOAD_SUCCESS":
      return { ...state, isLoading: false, error: null };
    case "SET_LOAD_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export interface UseWebsitePreviewProps {
  allowCrossOrigin?: boolean;
}

/**
 * Simplified version with clear source of truth priority:
 * 1. URL param exists → Always use it, override persisted state and input
 * 2. URL param doesn't exist → Use persisted currentUrl
 *
 * - inputValue: Local state for input field (uncontrolled, ephemeral)
 * - currentUrl: Persisted store state (only used when URL param doesn't exist)
 * - URL param: Single source of truth when it exists
 */
export function useWebsitePreview({ allowCrossOrigin = false }: UseWebsitePreviewProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Input field value (uncontrolled, just for typing)
  const [inputValue, setInputValue] = useState("");

  const [activeTab] = useQueryState("p");
  const [urlParam, setUrlParam] = useQueryState("url");
  const isCustomTab = activeTab === "custom";

  const currentUrl = useWebsitePreviewStore((state) => state.currentUrl);
  const setCurrentUrlStore = useWebsitePreviewStore((state) => state.setCurrentUrl);
  const resetStore = useWebsitePreviewStore((state) => state.reset);

  // Helper function to load URL into iframe
  const loadUrlIntoIframe = useCallback((url: string, cacheBuster: string = "_t") => {
    if (!iframeRef.current) return;
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set(cacheBuster, Date.now().toString());
      iframeRef.current.src = urlObj.toString();
    } catch {
      // Fallback for invalid URLs
      iframeRef.current.src = url + `?${cacheBuster}=${Date.now()}`;
    }
  }, []);

  // Sync effect: keep URL param and store in sync based on tab
  useEffect(() => {
    // Leaving custom tab: remove url param if present
    if (!isCustomTab) {
      if (urlParam) setUrlParam(null).catch(() => {});
      return;
    }

    // On custom tab:
    if (urlParam) {
      // URL is source of truth: reflect it in store and input
      if (urlParam !== currentUrl) setCurrentUrlStore(urlParam);
      if (urlParam !== inputValue) setInputValue(urlParam);
      return;
    }

    // No url param: restore from persisted store if available
    if (!urlParam && currentUrl) {
      setUrlParam(currentUrl).catch(() => {});
    }
  }, [isCustomTab, urlParam, currentUrl, setUrlParam, setCurrentUrlStore]);

  // Loader effect: load iframe whenever currentUrl changes
  useEffect(() => {
    if (!currentUrl) return;
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });
    loadUrlIntoIframe(currentUrl);
  }, [currentUrl, loadUrlIntoIframe]);

  const clearLoadingTimeout = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  };

  const handleIframeLoad = useCallback(() => {
    clearLoadingTimeout();
    dispatch({ type: "SET_LOAD_SUCCESS" });
  }, []);

  const handleIframeError = useCallback(() => {
    clearLoadingTimeout();
    dispatch({
      type: "SET_LOAD_ERROR",
      payload:
        "Failed to load website. This could be due to CORS restrictions or the site blocking iframes.",
    });
  }, []);

  useEffect(() => {
    if (state.isLoading && currentUrl) {
      clearLoadingTimeout();
      loadingTimeoutRef.current = setTimeout(() => {
        dispatch({
          type: "SET_LOAD_ERROR",
          payload: "Loading timeout - the website may be taking too long to respond",
        });
        loadingTimeoutRef.current = null;
      }, LOADING_TIMEOUT_MS);
      return clearLoadingTimeout;
    }
  }, [state.isLoading, currentUrl]);

  const setInputValueHandler = useCallback((url: string) => {
    setInputValue(url);
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const loadUrl = useCallback(() => {
    if (!inputValue.trim()) {
      dispatch({ type: "SET_LOAD_ERROR", payload: "Please enter a valid URL" });
      return;
    }

    let formattedUrl = inputValue.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }

    // Save to currentUrl (persisted)
    setCurrentUrlStore(formattedUrl);
    // If on custom tab, also update URL param
    if (isCustomTab) {
      setUrlParam(formattedUrl).catch(() => {});
    }
  }, [inputValue, setCurrentUrlStore, isCustomTab, setUrlParam, loadUrlIntoIframe]);

  const refreshIframe = useCallback(() => {
    if (!currentUrl) return;
    dispatch({ type: "SET_LOADING", payload: true });
    loadUrlIntoIframe(currentUrl, "_refresh");
  }, [currentUrl, loadUrlIntoIframe]);

  const openInNewTab = useCallback(() => {
    if (!currentUrl) return;
    window.open(currentUrl, "_blank", "noopener,noreferrer");
  }, [currentUrl]);

  const reset = useCallback(() => {
    clearLoadingTimeout();
    resetStore();
    setInputValue("");
    if (isCustomTab) setUrlParam(null).catch(() => {});
    dispatch({ type: "RESET" });
  }, [resetStore, isCustomTab, setUrlParam]);

  return {
    inputValue,
    currentUrl,
    setInputValue: setInputValueHandler,
    isLoading: state.isLoading,
    error: state.error,
    iframeRef,
    loadUrl,
    refreshIframe,
    openInNewTab,
    reset,
    handleIframeLoad,
    handleIframeError,
    allowCrossOrigin,
  };
}
