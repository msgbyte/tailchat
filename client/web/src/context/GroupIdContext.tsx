import React, { useContext } from 'react';

const GroupIdContext = React.createContext<string>('');
GroupIdContext.displayName = 'GroupIdContext';

export const GroupIdContextProvider = GroupIdContext.Provider;

export function useGroupIdContext(): string {
  return useContext(GroupIdContext);
}
