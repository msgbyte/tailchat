import React from 'react';
import { t } from 'tailchat-shared';
import { Problem } from './Problem';

interface ErrorBoundaryProps {
  message?: React.ReactNode;
  description?: string;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  {
    error?: Error | null;
    info: {
      componentStack?: string;
    };
  }
> {
  state = {
    error: undefined,
    info: {
      componentStack: '',
    },
  };

  componentDidCatch(error: Error | null, info: any) {
    this.setState({ error, info });
  }

  render() {
    const { message, description, children } = this.props;
    const { error, info } = this.state;
    const componentStack =
      info && info.componentStack ? info.componentStack : null;
    const errorMessage =
      typeof message === 'undefined' ? (error || '').toString() : message;
    const errorDescription =
      typeof description === 'undefined' ? componentStack : description;
    if (error) {
      return (
        <div className="p-2">
          <Problem
            text={
              <>
                <h3>{t('页面出现了一些问题')}</h3>
                <p title={errorDescription ?? ''}>{errorMessage}</p>
              </>
            }
          />
        </div>
      );
    }

    return children;
  }
}
