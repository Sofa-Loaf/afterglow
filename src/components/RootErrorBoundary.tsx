import * as SplashScreen from 'expo-splash-screen';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { View } from 'react-native';

import { CrashScreen } from './CrashScreen';

type Props = { children: ReactNode };
type State = { error: Error | null; nonce: number };

/**
 * Last-resort JS error UI. Production Play builds have no redbox; an uncaught
 * render error otherwise looks like an instant close.
 */
export class RootErrorBoundary extends Component<Props, State> {
  state: State = { error: null, nonce: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    void SplashScreen.hideAsync().catch(() => undefined);
    console.error('Afterglow root error', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      const message = this.state.error.message || String(this.state.error);
      return (
        <CrashScreen
          message={message}
          onRetry={() => this.setState((current) => ({ error: null, nonce: current.nonce + 1 }))}
        />
      );
    }
    return (
      <View key={this.state.nonce} style={{ flex: 1 }}>
        {this.props.children}
      </View>
    );
  }
}
