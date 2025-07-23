import { FileWarning } from "lucide-react";
import React from "react";

export class ComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; name: string; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; name: string; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in component ${this.props.name}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-destructive text-destructive-foreground flex size-full items-center justify-center gap-2 p-4">
          <FileWarning className="size-4" />
          <p className="text-sm text-pretty">
            Something went wrong in component:{" "}
            <span className="font-medium">{this.props.name}</span>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
