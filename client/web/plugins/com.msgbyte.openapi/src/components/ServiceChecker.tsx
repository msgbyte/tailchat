import { LoadingSpinner } from '@capital/component';
import { fetchAvailableServices, useAsync } from '@capital/common';
import React from 'react';
import { Translate } from '../translate';

/**
 * 服务监测
 */
export const ServiceChecker: React.FC<React.PropsWithChildren> = React.memo(
  (props) => {
    const { loading, value: enabled } = useAsync(async () => {
      const services = await fetchAvailableServices();
      return services.includes('openapi.app');
    }, []);

    if (loading) {
      return <LoadingSpinner />;
    }

    if (!enabled) {
      return <div>{Translate.noservice}</div>;
    }

    return <>{props.children}</>;
  }
);
ServiceChecker.displayName = 'ServiceChecker';
