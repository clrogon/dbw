import React from "react";
import { logClientError } from "@/lib/error-logging";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: unknown): State {
    const message =
      error instanceof Error ? error.message : "Please refresh the page or try again later.";
    return { hasError: true, message };
  }
  componentDidCatch(error: unknown, _info: React.ErrorInfo) {
    logClientError("ErrorBoundary", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
          <h2>Something went wrong</h2>
          <p style={{ color: "#666", maxWidth: 480, margin: "0.75rem auto" }}>
            {this.state.message || "Please refresh the page or try again later."}
          </p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
