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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock, CodeBlockCopyButton } from "@/components/ai-elements/code-block";
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

// Code snippets for quick installation across common setups
const HTML_SNIPPET = `<!-- Add inside <head> -->\n<script src="${SCRIPT_URL}"></script>`;

const NEXT_APP_SNIPPET = `// app/layout.tsx\nexport default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          crossOrigin="anonymous"
          src="${SCRIPT_URL}"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}`;

const NEXT_PAGES_SNIPPET = `// pages/_document.tsx\n
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          crossOrigin="anonymous"
          src="${SCRIPT_URL}"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}`;

const VITE_SNIPPET = `<!-- index.html -->\n<!doctype html>
<html lang="en">
  <head>
    <script
      crossOrigin="anonymous"
      src="${SCRIPT_URL}"
    />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>`;

const REMIX_SNIPPET = `// app/root.tsx\nimport { Links, Meta, Outlet, Scripts } from "@remix-run/react";

export default function App() {
  return (
    <html>
      <head>
        <link
          rel="icon"
          href="data:image/x-icon;base64,AA"
        />
        <Meta />
        <script
          crossOrigin="anonymous"
          src="${SCRIPT_URL}"
        />
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}`;

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
    reset,
    allowCrossOrigin,
  } = useDynamicWebsitePreview();

  return (
    <div className="flex size-full items-center gap-1.5">
      <div className="relative max-w-xl flex-1">
        <Input
          type="url"
          placeholder={
            !allowCrossOrigin
              ? "Enter same-origin URL for direct theme injection"
              : "Enter website URL (e.g., http://localhost:3000/login)"
          }
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onBlur={(e) => {
            if (e.target.value !== currentUrl) {
              loadUrl();
            }
          }}
          onKeyDown={(e) => {
            if (!inputUrl) return;
            if (e.key === "Enter") {
              loadUrl();
            }
          }}
          className={cn(
            "peer bg-background text-foreground h-8 pl-8 text-sm shadow-none transition-all duration-200",
            "focus:bg-input/50 hover:bg-input/20",
            currentUrl && "pr-8"
          )}
        />

        <Globe
          className={cn(
            "text-muted-foreground absolute top-0 left-2 size-4 translate-y-1/2 transition-colors",
            "peer-focus:text-foreground/70"
          )}
        />

        {currentUrl && (
          <Button
            variant="ghost"
            size="icon"
            onClick={reset}
            className="absolute top-0 right-0 size-8 translate-y-0 hover:bg-transparent"
          >
            <X className="text-muted-foreground hover:text-foreground size-3.5 transition-colors" />
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={refreshIframe}
        disabled={previewIsLoading || !currentUrl}
        className="size-8 shadow-none transition-all hover:scale-105"
      >
        <RefreshCw
          className={cn("size-3.5 transition-transform", previewIsLoading && "animate-spin")}
        />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={openInNewTab}
        disabled={!currentUrl}
        className="size-8 px-2 shadow-none transition-all hover:scale-105"
      >
        <ExternalLink className="size-3.5" />
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
        <div className="text-muted-foreground mx-auto flex h-full max-w-2xl flex-col items-center justify-center space-y-6">
          <div className="flex items-center gap-1">
            <div className="bg-muted outline-border/50 flex size-16 flex-col items-center justify-center space-y-2 rounded-full outline">
              <Globe className="text-foreground size-7" />
            </div>
            <X className="text-foreground size-6" />
            <div className="bg-muted outline-border/50 flex size-16 flex-col items-center justify-center space-y-2 rounded-full outline">
              <Logo className="text-foreground size-7" />
            </div>
          </div>

          <div className="space-y-3 text-center">
            <p className="text-foreground text-lg font-medium">Preview your website in tweakcn</p>
            <div className="text-muted-foreground space-y-2 text-left text-sm">
              <div className="flex gap-2">
                <span className="text-foreground font-semibold">1.</span>
                <span>Add the script below to your website based on your framework</span>
              </div>
              <div className="flex gap-2">
                <span className="text-foreground font-semibold">2.</span>
                <span>
                  Paste your website's URL (eg:{" "}
                  <span className="font-mono font-medium">http://localhost:3000</span>) above to
                  preview it with the theme applied in real-time
                </span>
              </div>
            </div>
          </div>

          {allowCrossOrigin && (
            <Card className="w-full p-2">
              <Tabs defaultValue="script" className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="bg-muted/50 flex items-center justify-between rounded-md border px-2 py-1">
                  <TabsList className="h-8 bg-transparent p-0">
                    <TabsTrigger value="script" className="h-7 px-3 text-xs font-medium">
                      Script Tag
                    </TabsTrigger>
                    <TabsTrigger value="next-app" className="h-7 px-3 text-xs font-medium">
                      Next.js (App)
                    </TabsTrigger>
                    <TabsTrigger value="next-pages" className="h-7 px-3 text-xs font-medium">
                      Next.js (Pages)
                    </TabsTrigger>
                    <TabsTrigger value="vite" className="h-7 px-3 text-xs font-medium">
                      Vite
                    </TabsTrigger>
                    <TabsTrigger value="remix" className="h-7 px-3 text-xs font-medium">
                      Remix
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="max-h-76 overflow-y-auto">
                  <TabsContent value="script">
                    <CodeBlock code={HTML_SNIPPET} language="html">
                      <CodeBlockCopyButton aria-label="Copy HTML snippet" />
                    </CodeBlock>
                  </TabsContent>
                  <TabsContent value="next-app">
                    <CodeBlock code={NEXT_APP_SNIPPET} language="tsx">
                      <CodeBlockCopyButton aria-label="Copy Next.js App snippet" />
                    </CodeBlock>
                  </TabsContent>
                  <TabsContent value="next-pages">
                    <CodeBlock code={NEXT_PAGES_SNIPPET} language="tsx">
                      <CodeBlockCopyButton aria-label="Copy Next.js Pages snippet" />
                    </CodeBlock>
                  </TabsContent>
                  <TabsContent value="vite">
                    <CodeBlock code={VITE_SNIPPET} language="html">
                      <CodeBlockCopyButton aria-label="Copy Vite snippet" />
                    </CodeBlock>
                  </TabsContent>
                  <TabsContent value="remix">
                    <CodeBlock code={REMIX_SNIPPET} language="tsx">
                      <CodeBlockCopyButton aria-label="Copy Remix snippet" />
                    </CodeBlock>
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          )}
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
