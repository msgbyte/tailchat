import { getDMConverseName } from '../../helper/converse-helper';
import { isValidStr, useAppSelector, useAsync } from '../../index';
import type { ChatConverseState } from '../slices/chat';
import { useUserId } from './useUserInfo';
import type { FriendInfo } from '../slices/user';

export function useDMConverseName(converse: ChatConverseState | undefined) {
  const userId = useUserId();
  const friends: FriendInfo[] = useAppSelector((state) => state.user.friends);
  const { value: name = '' } = useAsync(async () => {
    if (!converse) {
      return '';
    }

    if (!isValidStr(userId)) {
      return '';
    }

    return getDMConverseName(userId, converse);
  }, [userId, converse?.name, converse?.members.join(','), friends]);

  return name;
}
