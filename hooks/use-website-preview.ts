import { useCallback, useEffect, useReducer, useRef } from "react";

const LOADING_TIMEOUT_MS = 5000;

interface WebsitePreviewState {
  inputUrl: string;
  currentUrl: string;
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: "SET_INPUT_URL"; payload: string }
  | { type: "LOAD_URL_START"; payload: { url: string } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_LOAD_SUCCESS" }
  | { type: "SET_LOAD_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "RESET" };

const initialState: WebsitePreviewState = {
  inputUrl: "",
  currentUrl: "",
  isLoading: false,
  error: null,
};

function reducer(state: WebsitePreviewState, action: Action): WebsitePreviewState {
  switch (action.type) {
    case "SET_INPUT_URL":
      return { ...state, inputUrl: action.payload, error: null };
    case "LOAD_URL_START":
      return { ...state, isLoading: true, error: null, currentUrl: action.payload.url };
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
    if (state.isLoading && state.currentUrl) {
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
  }, [state.isLoading, state.currentUrl]);

  const setInputUrl = useCallback((url: string) => {
    dispatch({ type: "SET_INPUT_URL", payload: url });
  }, []);

  const loadUrl = useCallback(() => {
    if (!state.inputUrl.trim()) {
      dispatch({ type: "SET_LOAD_ERROR", payload: "Please enter a valid URL" });
      return;
    }

    let formattedUrl = state.inputUrl.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }

    dispatch({ type: "LOAD_URL_START", payload: { url: formattedUrl } });

    if (iframeRef.current) {
      try {
        const url = new URL(formattedUrl);
        url.searchParams.set("_t", Date.now().toString());
        iframeRef.current.src = url.toString();
      } catch {
        iframeRef.current.src = formattedUrl + "?_t=" + Date.now();
      }
    }
  }, [state.inputUrl]);

  const refreshIframe = useCallback(() => {
    if (!state.currentUrl || !iframeRef.current) return;
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const url = new URL(state.currentUrl);
      url.searchParams.set("_refresh", Date.now().toString());
      iframeRef.current.src = url.toString();
    } catch {
      iframeRef.current.src = state.currentUrl + "?_refresh=" + Date.now();
    }
  }, [state.currentUrl]);

  const openInNewTab = useCallback(() => {
    if (!state.currentUrl) return;
    window.open(state.currentUrl, "_blank", "noopener,noreferrer");
  }, [state.currentUrl]);

  const reset = useCallback(() => {
    clearLoadingTimeout();
    dispatch({ type: "RESET" });
  }, []);

  return {
    ...state,
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
