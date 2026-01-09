import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-black px-6">
                    <div className="max-w-md w-full bento-card-dark text-center">
                        <div className="text-6xl mb-6">⚠️</div>
                        <h1 className="text-3xl font-bold gradient-heading mb-4">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-gray-400 mb-6">
                            We're sorry for the inconvenience. The error has been logged and we'll fix it soon.
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="btn-pill justify-center w-full"
                        >
                            Go to Home
                        </button>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-300">
                                    Error Details (Development Mode)
                                </summary>
                                <pre className="mt-4 p-4 bg-zinc-900 rounded-lg overflow-auto text-xs text-red-400">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
