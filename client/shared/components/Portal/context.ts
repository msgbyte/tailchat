import React from 'react';

export type PortalMethods = {
  mount: (name: string, children: React.ReactNode) => number;
  update: (name: string, key: number, children: React.ReactNode) => void;
  unmount: (name: string, key: number) => void;
};

export function createPortalContext(name: string) {
  const PortalContext = React.createContext<PortalMethods | null>(null);
  PortalContext.displayName = 'PortalContext-' + name;

  return PortalContext;
}
