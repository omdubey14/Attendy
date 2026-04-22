import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-shell flex min-h-screen items-center justify-center p-6">
          <div className="card max-w-lg text-center">
            <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              The dashboard hit an unexpected error. Refresh the page to try again.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
