import { getDMConverseName } from '../../helper/converse-helper';
import { isValidStr, useAsync } from '../../index';
import type { ChatConverseState } from '../slices/chat';
import { useUserId } from './useUserInfo';

export function useDMConverseName(converse: ChatConverseState) {
  const userId = useUserId();
  const { value: name = '' } = useAsync(async () => {
    if (!isValidStr(userId)) {
      return '';
    }

    return getDMConverseName(userId, converse);
  }, [userId, converse.name, converse.members.join(',')]);

  return name;
}
