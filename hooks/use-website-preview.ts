import { useCallback, useEffect, useReducer, useRef } from "react";
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

export function useWebsitePreview({ allowCrossOrigin = false }: UseWebsitePreviewProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inputUrl = useWebsitePreviewStore((state) => state.inputUrl);
  const currentUrl = useWebsitePreviewStore((state) => state.currentUrl);
  const setInputUrlStore = useWebsitePreviewStore((state) => state.setInputUrl);
  const setCurrentUrlStore = useWebsitePreviewStore((state) => state.setCurrentUrl);
  const resetStore = useWebsitePreviewStore((state) => state.reset);

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

  const setInputUrl = useCallback(
    (url: string) => {
      setInputUrlStore(url);
      dispatch({ type: "CLEAR_ERROR" });
    },
    [setInputUrlStore]
  );

  const loadUrl = useCallback(() => {
    if (!inputUrl.trim()) {
      dispatch({ type: "SET_LOAD_ERROR", payload: "Please enter a valid URL" });
      return;
    }

    let formattedUrl = inputUrl.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }

    setCurrentUrlStore(formattedUrl);
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });

    if (iframeRef.current) {
      try {
        const url = new URL(formattedUrl);
        url.searchParams.set("_t", Date.now().toString());
        iframeRef.current.src = url.toString();
      } catch {
        iframeRef.current.src = formattedUrl + "?_t=" + Date.now();
      }
    }
  }, [inputUrl, setCurrentUrlStore]);

  const refreshIframe = useCallback(() => {
    if (!currentUrl || !iframeRef.current) return;
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const url = new URL(currentUrl);
      url.searchParams.set("_refresh", Date.now().toString());
      iframeRef.current.src = url.toString();
    } catch {
      iframeRef.current.src = currentUrl + "?_refresh=" + Date.now();
    }
  }, [currentUrl]);

  const openInNewTab = useCallback(() => {
    if (!currentUrl) return;
    window.open(currentUrl, "_blank", "noopener,noreferrer");
  }, [currentUrl]);

  const reset = useCallback(() => {
    clearLoadingTimeout();
    resetStore();
    dispatch({ type: "RESET" });
  }, [resetStore]);

  return {
    inputUrl,
    currentUrl,
    isLoading: state.isLoading,
    error: state.error,
    iframeRef,
    setInputUrl,
    loadUrl,
    refreshIframe,
    openInNewTab,
    reset,
    handleIframeLoad,
    handleIframeError,
    allowCrossOrigin,
  };
}
