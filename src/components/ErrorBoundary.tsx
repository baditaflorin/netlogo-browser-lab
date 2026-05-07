import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  error?: Error;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="fatal-error">
          <h1>Something went sideways.</h1>
          <p>{this.state.error.message}</p>
        </main>
      );
    }
    return this.props.children;
  }
}
