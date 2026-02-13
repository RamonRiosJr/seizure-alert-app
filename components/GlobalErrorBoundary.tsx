import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global Error Boundary (Medical-Grade Reliability)
 * Catches runtime crashes and provides a senior-friendly recovery UI.
 */
export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[CRITICAL ERROR]:', error, errorInfo);
    // Future: Integrate with remote telemetry here
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
          <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl overflow-hidden relative">
            {/* Animated Glow Backdrop */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500/20 blur-3xl rounded-full" />

            <div className="relative z-10">
              <div className="inline-flex p-4 rounded-2xl bg-red-500/10 mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                System Hiccup Detected
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Aura encountered an unexpected issue. Don't worry—your data is safe, but we need to
                restart the engine.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-6 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 group"
                >
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  Restart Engine Now
                </button>

                <button
                  onClick={() => (window.location.href = '/')}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Back to Dashboard
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <details className="mt-8 text-left text-[10px] bg-black/40 p-4 rounded-xl border border-white/5 overflow-auto max-h-40">
                  <summary className="cursor-pointer text-slate-500 font-mono mb-2">
                    Technical Insight (Dev Only)
                  </summary>
                  <pre className="whitespace-pre-wrap text-red-400 font-mono italic">
                    {this.state.error?.stack || this.state.error?.toString()}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
