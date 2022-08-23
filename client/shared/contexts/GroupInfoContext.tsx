import React, { useContext } from 'react';
import type { GroupInfo } from '..';

/**
 * 群组信息上下文
 */

interface GroupInfoContextProps {
  groupInfo: GroupInfo | null;
}
const GroupInfoContext = React.createContext<GroupInfoContextProps>({
  groupInfo: null,
});
GroupInfoContext.displayName = 'GroupInfoContext';

export const GroupInfoContextProvider: React.FC<{
  groupInfo: GroupInfo;
}> = React.memo((props) => {
  return (
    <GroupInfoContext.Provider
      value={{
        groupInfo: props.groupInfo,
      }}
    >
      {props.children}
    </GroupInfoContext.Provider>
  );
});
GroupInfoContextProvider.displayName = 'GroupInfoContextProvider';

export function useGroupInfoContext(): GroupInfoContextProps['groupInfo'] {
  const context = useContext(GroupInfoContext);

  return context.groupInfo;
}
