import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{ padding: '20px', color: 'white', backgroundColor: '#333', height: '100vh' }}>
                    <h1>Something went wrong.</h1>
                    <p>Please report this error:</p>
                    <pre style={{ color: '#ff6b6b', whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                    </pre>
                    <details style={{ marginTop: '20px' }}>
                        <summary>Component Stack</summary>
                        <pre style={{ fontSize: '10px' }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
