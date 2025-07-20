"use client";

import { useState, useRef, useEffect } from "react";
import { setIframeForPostMessage } from "@/store/editor-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomUrlPreviewProps {
  onUrlChange?: (url: string) => void;
}

export default function CustomUrlPreview({ onUrlChange }: CustomUrlPreviewProps) {
  const [url, setUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [_isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setIframeForPostMessage(iframeRef.current);

    return () => {
      setIframeForPostMessage(null);
    };
  }, [submittedUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    setSubmittedUrl(formattedUrl);
    onUrlChange?.(formattedUrl);
    setIsLoading(false);
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    if (!newUrl.trim()) {
      setSubmittedUrl("");
      onUrlChange?.("");
    }
  };

  return (
    <div className="flex h-full flex-col">
      {!submittedUrl ? (
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Enter Website URL</CardTitle>
              <CardDescription>
                Enter a URL to preview any website with your custom theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url-input">Website URL</Label>
                  <Input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={!url.trim()}>
                  Load Website
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <div className="flex items-center gap-2">
              <Input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
                className="flex-1"
                placeholder="Enter new URL..."
              />
              <Button onClick={handleSubmit} disabled={!url.trim()}>
                Update
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSubmittedUrl("");
                  setUrl("");
                  onUrlChange?.("");
                }}
              >
                Clear
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <iframe
              ref={iframeRef}
              src={submittedUrl}
              width="100%"
              height="800"
              className="border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        </div>
      )}
    </div>
  );
}
