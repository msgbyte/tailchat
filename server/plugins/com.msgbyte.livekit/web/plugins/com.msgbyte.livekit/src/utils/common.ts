import React from 'react';

export function cloneSingleChild(
  children: React.ReactNode | React.ReactNode[],
  props?: Record<string, any>,
  key?: any
) {
  return React.Children.map(children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child) && React.Children.only(children)) {
      return React.cloneElement(child, { ...props, key });
    }
    return child;
  });
}
