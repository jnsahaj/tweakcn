"use client";

import Logo from "@/assets/logo.svg";
import {
  BlockViewerDisplay,
  BlockViewerProvider,
  BlockViewerToolbar,
} from "@/components/block-viewer";
import { CopyButton } from "@/components/copy-button";
import { LoadingLogo } from "@/components/editor/ai/loading-logo";
import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { SocialLink } from "@/components/social-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { useIframeThemeInjector } from "@/hooks/use-iframe-theme-injector";
import { useWebsitePreview } from "@/hooks/use-website-preview";
import { cn } from "@/lib/utils";
import { IframeStatus } from "@/types/live-preview-embed";
import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Globe,
  GlobeLock,
  Info,
  Loader,
  RefreshCw,
  X,
  XCircle,
} from "lucide-react";
import React from "react";

/**
 * Dynamic Website Preview - Load and theme external websites
 *
 * Usage Examples:
 *
 * // Same-origin mode (default) - direct DOM theme injection
 * <DynamicWebsitePreview name="Local Preview" />
 *
 * // Cross-origin mode - requires external sites to include embed script
 * <DynamicWebsitePreview name="External Preview" allowCrossOrigin />
 *
 * The allowCrossOrigin flag must be explicitly set to true to enable
 * external website theming via the embed script.
 */

const SCRIPT_URL = "https://tweakcn.com/live-preview-embed-script.js";
const TWEAKCN_EMBED_SCRIPT_TAG = `<script src="${SCRIPT_URL}"/>`;

export function DynamicWebsitePreview({
  className,
  name,
  allowCrossOrigin = false,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  name: string;
  allowCrossOrigin?: boolean;
}) {
  return (
    <DynamicWebsitePreviewProvider allowCrossOrigin={allowCrossOrigin}>
      <BlockViewerProvider>
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
      </BlockViewerProvider>
    </DynamicWebsitePreviewProvider>
  );
}

type DynamicWebsitePreviewContextType = ReturnType<typeof useWebsitePreview> &
  Omit<ReturnType<typeof useIframeThemeInjector>, "ref">;

const DynamicWebsitePreviewContext = React.createContext<DynamicWebsitePreviewContextType | null>(
  null
);

function useDynamicWebsitePreview() {
  const context = React.useContext(DynamicWebsitePreviewContext);
  if (!context) {
    throw new Error(
      "useDynamicWebsitePreview must be used within a DynamicWebsitePreviewProvider."
    );
  }
  return context;
}

function DynamicWebsitePreviewProvider({
  children,
  allowCrossOrigin = false,
}: {
  children: React.ReactNode;
  allowCrossOrigin?: boolean;
}) {
  const websitePreviewState = useWebsitePreview({ allowCrossOrigin });

  const { status, retryValidation, themeInjectionError } = useIframeThemeInjector({
    allowCrossOrigin: allowCrossOrigin && !!websitePreviewState.currentUrl,
    iframeRef: websitePreviewState.iframeRef,
  });

  const contextValue = {
    ...websitePreviewState,
    status,
    retryValidation,
    themeInjectionError,
  };

  return (
    <DynamicWebsitePreviewContext.Provider value={contextValue}>
      {children}
    </DynamicWebsitePreviewContext.Provider>
  );
}

function DynamicToolbarControls() {
  const {
    inputUrl,
    setInputUrl,
    currentUrl,
    isLoading: previewIsLoading,
    loadUrl,
    refreshIframe,
    openInNewTab,
    allowCrossOrigin,
  } = useDynamicWebsitePreview();

  return (
    <div className="flex size-full items-center gap-1">
      <div className="relative max-w-xl flex-1">
        <Input
          type="url"
          placeholder={
            !allowCrossOrigin
              ? "Enter same-origin URL for direct theme injection"
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
        disabled={previewIsLoading || !inputUrl}
        size="sm"
        className="h-8 w-16 shadow-none"
      >
        {previewIsLoading ? <Loader className="size-3 animate-spin" /> : "Load"}
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={refreshIframe}
        disabled={previewIsLoading || !currentUrl}
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

/**
 * Content component that manages the iframe and its loading states
 * Theme injection is now handled entirely by the useIframeThemeInjector hook
 */
function DynamicIframeContent() {
  const {
    currentUrl,
    isLoading: previewIsLoading,
    error: previewError,
    status,
    retryValidation,
    allowCrossOrigin,
    iframeRef,
    handleIframeLoad,
    handleIframeError,
    themeInjectionError,
  } = useDynamicWebsitePreview();

  if (!currentUrl && !previewError) {
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
              <span className="font-medium">shadcn/ui</span> components.{" "}
              {allowCrossOrigin ? (
                <span>
                  External sites can integrate with tweakcn by including our script for{" "}
                  <span className="font-medium">live theme previews</span>.
                </span>
              ) : (
                "Same-origin websites support direct theme injection without requiring external scripts."
              )}
            </p>
          </div>

          <Card className="w-full space-y-1 p-2">
            <div className="flex w-full items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs">
                <span className="font-medium">For external website integration:</span>
              </p>

              <CopyButton textToCopy={TWEAKCN_EMBED_SCRIPT_TAG} className="[&>svg]:size-3" />
            </div>
            <code className="text-foreground bg-muted block rounded-md border p-2 font-mono text-xs">
              {TWEAKCN_EMBED_SCRIPT_TAG}
            </code>
          </Card>
        </div>
      </div>
    );
  }

  if (previewError) {
    return (
      <div className="relative size-full overflow-hidden p-4">
        <div className="flex h-full flex-col items-center justify-center space-y-2 p-4 text-center">
          <p className="text-destructive text-sm font-medium">Error Loading Website</p>
          <span className="text-muted-foreground max-w-md text-xs">{previewError}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative size-full overflow-hidden">
      {previewIsLoading && (
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
        ref={iframeRef}
        src={currentUrl}
        title="Dynamic Website Preview"
        className="size-full"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox={
          allowCrossOrigin
            ? "allow-scripts allow-same-origin allow-forms allow-popups"
            : "allow-scripts allow-same-origin"
        }
        loading="lazy"
      />

      {!previewIsLoading && !!status && allowCrossOrigin && (
        <div className="absolute bottom-2 left-2 z-10">
          <ConnectionStatus
            status={status}
            retryValidation={retryValidation}
            isLoading={previewIsLoading}
            errorMsg={themeInjectionError}
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
  errorMsg,
}: {
  status: IframeStatus;
  retryValidation: () => void;
  isLoading: boolean;
  errorMsg?: string | null;
}) {
  if (isLoading || status === "unknown") return null;

  return (
    <div className="bg-popover/90 outline-border/50 flex h-8 items-center gap-2 rounded-lg px-2 shadow-sm outline backdrop-blur-lg">
      <div className="flex items-center gap-1">
        <span className="text-foreground/90">
          {errorMsg ? (
            <HoverCard>
              <HoverCardTrigger>{ICONS[status]}</HoverCardTrigger>
              <HoverCardContent
                align="start"
                side="top"
                className="size-fit max-w-[280px] min-w-[140px] p-2"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Info className="size-3" />
                    <p className="text-xs font-medium">Error details:</p>
                  </div>

                  <p className="text-muted-foreground text-xs text-pretty">{errorMsg}</p>

                  {status === "missing" && (
                    <code className="text-foreground bg-muted group/script relative isolate block overflow-hidden rounded-md border">
                      <HorizontalScrollArea className="relative isolate">
                        <span className="p-2 font-mono text-xs text-nowrap">
                          {TWEAKCN_EMBED_SCRIPT_TAG}
                        </span>
                      </HorizontalScrollArea>

                      <CopyButton
                        variant="default"
                        size="icon"
                        textToCopy={TWEAKCN_EMBED_SCRIPT_TAG}
                        className="absolute top-1 right-1 z-10 hidden group-hover/script:inline-flex [&>svg]:size-3"
                      />
                    </code>
                  )}

                  {status === "unsupported" && (
                    <div className="space-y-1">
                      <p className="border-primary! border-l-2 pl-2 text-xs font-medium text-pretty">
                        Consult the shadcn/ui docs for more information:
                      </p>
                      <div className="flex flex-col gap-0.5">
                        <SocialLink
                          showIcon
                          href="https://ui.shadcn.com/docs/installation"
                          className="text-primary text-xs"
                        >
                          Installation docs
                        </SocialLink>
                        <SocialLink
                          showIcon
                          href="https://ui.shadcn.com/docs/theming"
                          className="text-primary text-xs"
                        >
                          Theming docs
                        </SocialLink>
                      </div>
                    </div>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            ICONS[status]
          )}
        </span>
        <span className="text-foreground/90 flex items-center gap-1 text-sm font-medium">
          {TEXTS[status]}
        </span>
      </div>

      {(status === "missing" || status === "unsupported" || status === "error") && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs shadow-none"
            onClick={retryValidation}
          >
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}

const ICONS: Record<IframeStatus, React.ReactNode> = {
  unknown: null,
  checking: <Loader className="size-4 animate-spin" />,
  connected: <CheckCircle className="size-4" />,
  supported: <CheckCircle className="size-4" />,
  unsupported: <AlertCircle className="size-4" />,
  missing: <XCircle className="text-destructive size-4" />,
  error: <XCircle className="text-destructive size-4" />,
};

const TEXTS: Record<IframeStatus, string> = {
  unknown: "",
  checking: "Checking connection",
  connected: "Connected",
  supported: "Live preview enabled",
  unsupported: "Unsupported site",
  missing: "Script not found",
  error: "An error occurred",
};
