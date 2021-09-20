import { getCachedUserInfo, isValidStr, useAsync } from '../../index';
import type { ChatConverseState } from '../slices/chat';
import { useUserId } from './useUserInfo';

export function useDMConverseName(converse: ChatConverseState) {
  const userId = useUserId();
  const otherConverseMembers = converse.members.filter((m) => m !== userId); // 成员Id
  const len = otherConverseMembers.length;
  const { value: otherMembersInfo = [] } = useAsync(() => {
    return Promise.all(
      otherConverseMembers.map((userId) => getCachedUserInfo(userId))
    );
  }, [otherConverseMembers.join(',')]);

  if (isValidStr(converse.name)) {
    return converse.name;
  }

  if (len === 1) {
    return otherMembersInfo[0]?.nickname ?? '';
  } else if (len === 2) {
    return `${otherMembersInfo[0]?.nickname}, ${otherMembersInfo[1]?.nickname}`;
  } else {
    return `${otherMembersInfo[0]?.nickname}, ${otherMembersInfo[1]?.nickname} ...`;
  }
}
