import React from 'react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="text-center p-8">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">페이지 로딩 오류</h2>
                        <p className="text-slate-500 mb-6">일시적인 오류가 발생했습니다.</p>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false });
                                window.location.href = window.location.pathname;
                            }}
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                            다시 시도
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
