import React from 'react';

interface CreateContextFactoryOptions<Props> {
  defaultValue: Props;
  displayName: string;
}

export function createContextFactory<Props>(
  options: CreateContextFactoryOptions<Props>
) {
  const Context = React.createContext(options.defaultValue);
  Context.displayName = options.displayName;

  function useContext(): Props {
    return React.useContext(Context);
  }

  return {
    Context,
    useContext,
  };
}
