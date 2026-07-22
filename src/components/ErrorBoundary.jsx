import React, { Component } from "react";
import { ShieldAlert } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-xl text-center my-6 max-w-lg mx-auto shadow-sm">
          <ShieldAlert className="w-12 h-12 text-red-700 mb-3" />
          <h2 className="font-serif text-xl font-bold text-red-950">Something Went Wrong</h2>
          <p className="text-stone-700 text-sm mt-2 leading-relaxed">
            The scribes encountered an error translating this section of the archives. Try reloading the page or switching views.
          </p>
          {this.state.error && (
            <code className="block bg-white text-red-800 text-xs font-mono p-2 rounded border border-red-200 mt-4 max-w-full overflow-x-auto text-left">
              {this.state.error.toString()}
            </code>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-6 px-4 py-2 bg-red-800 text-white rounded hover:bg-red-950 font-sans text-xs font-semibold cursor-pointer"
          >
            Clear Error & Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
