import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught UI render error caught safely:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white font-sans select-none">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-4 shadow-lg animate-pulse">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-serif font-bold text-white mb-1.5">
            {this.props.fallbackTitle || 'Profile Display Notice'}
          </h2>
          <p className="text-xs text-slate-300 max-w-xs leading-relaxed mb-5">
            {this.props.fallbackMessage || 'A minor display issue occurred while loading this matrimonial biodata. The app has been protected from closing.'}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh & Continue</span>
            </button>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="px-4 py-2.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold hover:bg-slate-700 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
