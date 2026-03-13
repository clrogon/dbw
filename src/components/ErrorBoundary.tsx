import React from "react";
import { logClientError } from "@/lib/error-logging";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_error: any): State {
    return { hasError: true };
  }
  componentDidCatch(_error: any, _info: React.ErrorInfo) {
    // Log error for debugging; avoid surfacing raw errors to users
    logClientError("Unhandled error in DBW app", _error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
