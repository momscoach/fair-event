import { Component, type ComponentChildren } from 'preact';

type Props = { children: ComponentChildren };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // 박람회 운영 측 디버깅용 — 실제 사용자에게 노출되지는 않음
    console.error('ErrorBoundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div class="app-shell">
          <div class="error-fallback">
            <h1 class="error-title">잠시 문제가 발생했습니다</h1>
            <p class="error-message">페이지를 새로고침해주세요</p>
            <button
              class="btn btn-primary btn-full"
              onClick={() => window.location.reload()}
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
