import Logo from "@/assets/logo.svg";
import {
  BlockViewerDisplay,
  BlockViewerProvider,
  BlockViewerToolbar,
} from "@/components/block-viewer";
import { CopyButton } from "@/components/copy-button";
import { LoadingLogo } from "@/components/editor/ai/loading-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { IframeStatus, useIframeThemeInjector } from "@/hooks/use-iframe-theme-injector";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { applyThemeToElement } from "@/utils/apply-theme";
import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Globe,
  GlobeLock,
  Loader,
  RefreshCw,
  X,
  XCircle,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const DYNAMIC_IFRAME_ID = "dynamic-block-iframe";
const SCRIPT_URL = "https://tweakcn.com/live-preview-embed-script.js";

export function DynamicBlockViewer({
  className,
  name,
  useDirectInjection = false,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  name: string;
  dynamic?: boolean;
  useDirectInjection?: boolean;
}) {
  return (
    <DynamicBlockViewerProvider useDirectInjection={useDirectInjection}>
      <div
        className={cn(
          "group/block-view-wrapper bg-background @container isolate flex size-full min-w-0 flex-col overflow-clip",
          className
        )}
        {...props}
      >
        <BlockViewerToolbar name={name} toolbarControls={<DynamicToolbarControls />} />
        <BlockViewerDisplay name={name}>
          <DynamicIframeContent />
        </BlockViewerDisplay>
      </div>
    </DynamicBlockViewerProvider>
  );
}

type DynamicBlockViewerContext = {
  inputUrl: string;
  setInputUrl: (url: string) => void;
  currentUrl: string;
  setCurrentUrl: (url: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  useDirectInjection: boolean;
  status: IframeStatus;
  retryValidation: () => void;
};

const DynamicBlockViewerContext = React.createContext<DynamicBlockViewerContext | null>(null);

function useDynamicBlockViewer() {
  const context = React.useContext(DynamicBlockViewerContext);
  if (!context) {
    throw new Error("useDynamicBlockViewer must be used within a DynamicBlockViewerProvider.");
  }
  return context;
}

function DynamicBlockViewerProvider({
  children,
  useDirectInjection = false,
}: {
  children: React.ReactNode;
  useDirectInjection?: boolean;
}) {
  const [inputUrl, setInputUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { status, retryValidation } = useIframeThemeInjector(
    DYNAMIC_IFRAME_ID,
    !useDirectInjection && !!currentUrl
  );

  return (
    <BlockViewerProvider>
      <DynamicBlockViewerContext.Provider
        value={{
          inputUrl,
          setInputUrl,
          currentUrl,
          setCurrentUrl,
          isLoading,
          setIsLoading,
          error,
          setError,
          useDirectInjection: useDirectInjection,
          status,
          retryValidation,
        }}
      >
        {children}
      </DynamicBlockViewerContext.Provider>
    </BlockViewerProvider>
  );
}

function DynamicToolbarControls() {
  const {
    inputUrl,
    setInputUrl,
    currentUrl,
    setCurrentUrl,
    isLoading,
    setIsLoading,
    setError,
    useDirectInjection,
  } = useDynamicBlockViewer();

  const loadUrl = () => {
    if (!inputUrl.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    // Add protocol if missing
    let formattedUrl = inputUrl.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setCurrentUrl(formattedUrl);
    setIsLoading(true);
    setError(null);
  };

  const refreshIframe = () => {
    if (currentUrl) {
      setIsLoading(true);
      setError(null);
      // Force iframe refresh by changing src
      const iframe = document.getElementById(DYNAMIC_IFRAME_ID) as HTMLIFrameElement;
      if (iframe) {
        iframe.src = currentUrl;
      }
    }
  };

  const openInNewTab = () => {
    if (currentUrl) {
      window.open(currentUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="flex size-full items-center gap-1">
      <div className="relative max-w-xl flex-1">
        <Input
          type="url"
          placeholder={
            useDirectInjection
              ? "Enter same-origin URL for theme injection"
              : "Enter website URL (e.g., tweakcn.com)"
          }
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={(e) => {
            if (!inputUrl) return;
            if (e.key === "Enter") {
              loadUrl();
            }
          }}
          className="peer bg-input h-8 pl-8 text-sm shadow-none"
        />

        <Globe className="text-muted-foreground absolute top-0 left-2 size-4 translate-y-1/2" />
      </div>

      <Button
        onClick={loadUrl}
        disabled={isLoading || !inputUrl}
        size="sm"
        className="h-8 w-16 shadow-none"
      >
        {isLoading ? <Loader className="size-3 animate-spin" /> : "Load"}
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={refreshIframe}
        disabled={isLoading || !currentUrl}
        className="size-8 shadow-none"
      >
        <RefreshCw className={cn("size-3")} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={openInNewTab}
        disabled={!currentUrl}
        className="size-8 px-2 shadow-none"
      >
        <ExternalLink className="size-3" />
      </Button>
    </div>
  );
}

function DynamicIframeContent() {
  const {
    currentUrl,
    isLoading,
    setIsLoading,
    error,
    setError,
    useDirectInjection,
    status,
    retryValidation,
  } = useDynamicBlockViewer();
  const { themeState } = useEditorStore();
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  useIframeThemeInjector(DYNAMIC_IFRAME_ID, !useDirectInjection && isIframeLoaded);

  const clearLoadingTimeout = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  };

  const handleIframeLoad = () => {
    clearLoadingTimeout();
    setIsLoading(false);
    setError(null);
    setIsIframeLoaded(true);

    // Inject theme if allowed and same-origin
    if (useDirectInjection && currentUrl) {
      try {
        const iframe = document.getElementById(DYNAMIC_IFRAME_ID) as HTMLIFrameElement;
        if (iframe && iframe.contentDocument) {
          // Only works for same-origin content
          const iframeRoot = iframe.contentDocument.documentElement;
          if (iframeRoot) {
            applyThemeToElement(themeState, iframeRoot);
          }
        }
      } catch (e) {
        console.warn("Cannot inject theme into cross-origin iframe:", e);
      }
    }
  };

  useEffect(() => {
    if (currentUrl) {
      setIsIframeLoaded(false);
    }
  }, [currentUrl]);

  // Set up timeout when loading starts
  useEffect(() => {
    if (isLoading && currentUrl) {
      clearLoadingTimeout(); // Clear any existing timeout

      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        setError("Loading timeout - the website may be taking too long to respond");
        loadingTimeoutRef.current = null;
      }, 5000); // 5 second timeout

      return clearLoadingTimeout;
    }
  }, [isLoading, currentUrl, setIsLoading, setError]);

  // Watch for theme changes and re-inject if possible
  useEffect(() => {
    if (useDirectInjection && currentUrl && !isLoading) {
      try {
        const iframe = document.getElementById(DYNAMIC_IFRAME_ID) as HTMLIFrameElement;
        if (iframe && iframe.contentDocument) {
          const iframeRoot = iframe.contentDocument.documentElement;
          if (iframeRoot) {
            applyThemeToElement(themeState, iframeRoot);
          }
        }
      } catch (e) {
        console.error("Cannot inject theme into cross-origin iframe:", e);
      }
    }
  }, [themeState, useDirectInjection, currentUrl, isLoading]);

  const handleIframeError = () => {
    clearLoadingTimeout();
    setIsLoading(false);
    setError(
      "Failed to load website. This could be due to CORS restrictions or the site blocking iframes."
    );
  };

  const scriptTag = `<script src="${SCRIPT_URL}"></script>`;

  if (!currentUrl && !error) {
    return (
      <div className="relative size-full overflow-hidden p-4">
        <div className="text-muted-foreground mx-auto flex h-full max-w-lg flex-col items-center justify-center space-y-6">
          <div className="flex items-center gap-1">
            <div className="bg-muted outline-border/50 flex size-16 flex-col items-center justify-center space-y-2 rounded-full outline">
              <GlobeLock className="text-foreground size-7" />
            </div>
            <X className="text-foreground size-6" />
            <div className="bg-muted outline-border/50 flex size-16 flex-col items-center justify-center space-y-2 rounded-full outline">
              <Logo className="text-foreground size-7" />
            </div>
          </div>

          <div className="space-y-1 text-center">
            <p className="text-foreground text-lg font-medium">Preview External Websites</p>
            <p className="text-muted-foreground text-sm text-pretty">
              Enter a URL to preview websites built with{" "}
              <span className="font-medium">shadcn/ui</span> components. External sites using
              shadcn/ui can integrate with tweakcn by including our script for live theme previews.
            </p>
          </div>

          <Card className="w-full space-y-1 p-2">
            <div className="flex w-full items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs">
                <span className="font-medium">For external website integration:</span>
              </p>

              <CopyButton textToCopy={scriptTag} className="[&>svg]:size-3" />
            </div>
            <code className="text-foreground bg-muted block rounded-md border p-2 font-mono text-xs">
              {scriptTag}
            </code>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative size-full overflow-hidden p-4">
        <div className="flex h-full flex-col items-center justify-center space-y-2 p-4 text-center">
          <p className="text-destructive text-sm font-medium">Error Loading Website</p>
          <span className="text-muted-foreground max-w-md text-xs">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative size-full overflow-hidden">
      {isLoading && (
        <div className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className="relative size-6">
              <LoadingLogo />
            </div>

            <p className="inline-flex animate-pulse gap-0.25">
              <span className="text-sm">Loading website</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
              <span className="animate-bounce delay-300">.</span>
            </p>
          </div>
        </div>
      )}

      <iframe
        id={DYNAMIC_IFRAME_ID}
        src={currentUrl}
        title="Dynamic Website Preview"
        className="size-full"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        loading="lazy"
      />

      {!isLoading && !!status && (
        <div className="bg-background/60 outline-border/50 absolute bottom-2 left-2 z-10 rounded-md px-2 py-1 outline-2 backdrop-blur-lg">
          <ConnectionStatus
            status={status}
            retryValidation={retryValidation}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}

function ConnectionStatus({
  status,
  retryValidation,
  isLoading,
}: {
  status: IframeStatus;
  retryValidation: () => void;
  isLoading: boolean;
}) {
  if (isLoading || status === "unknown") return null;

  const ICONS: Record<IframeStatus, React.ReactNode> = {
    checking: <Loader className="text-foreground size-4 animate-spin" />,
    connected: <CheckCircle className="text-foreground size-4" />,
    supported: <CheckCircle className="text-foreground size-4" />,
    unsupported: <AlertCircle className="text-foreground size-4" />,
    missing: <XCircle className="text-destructive size-4" />,
    unknown: null,
  };

  const TEXTS: Record<IframeStatus, string> = {
    checking: "Checking connection...",
    connected: "Connected",
    supported: "Live preview enabled",
    unsupported: "Unsupported site",
    missing: "Script not found",
    unknown: "",
  };

  return (
    <div className="flex h-8 items-center gap-2">
      {ICONS[status]}
      <span className="text-muted-foreground text-sm font-medium">{TEXTS[status]}</span>
      {(status === "missing" || status === "unsupported") && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 py-1 text-xs"
          onClick={retryValidation}
        >
          Retry
        </Button>
      )}
    </div>
  );
}
