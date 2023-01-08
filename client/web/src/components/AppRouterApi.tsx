import React from 'react';
import type { PropsWithChildren } from 'react';
import { useNavigate, NavigateFunction } from 'react-router';

export let navigate: NavigateFunction = () => {
  throw new Error('route navigate not init');
};

export const AppRouterApi: React.FC<PropsWithChildren> = React.memo(() => {
  const _navigate = useNavigate();
  navigate = _navigate;

  return null;
});
AppRouterApi.displayName = 'AppRouterApi';
