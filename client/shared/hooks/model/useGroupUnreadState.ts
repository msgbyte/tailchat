import { GroupPanelType } from '../../model/group';
import { useGroupInfo } from '../../redux/hooks/useGroup';
import { useUserNotifyMute } from './useUserSettings';
import _zip from 'lodash/zip';
import { useUnread } from '../../redux/hooks/useUnread';

/**
 * 检查群组未读消息的状态
 * @param groupId 群组id
 */
export function useGroupUnreadState(
  groupId: string
): 'none' | 'muted' | 'unread' {
  const group = useGroupInfo(groupId);
  const groupTextPanelIds = (group?.panels ?? [])
    .filter((panel) => panel.type === GroupPanelType.TEXT)
    .map((p) => p.id);

  const { mutedList } = useUserNotifyMute();

  const unreadList = useUnread(groupTextPanelIds);
  const unreadEntires = _zip(groupTextPanelIds, unreadList);
  let hasUnread = false;
  let hasUnmutedUnread = false;
  const isGroupMuted = mutedList.includes(groupId); // 群组自身是否被禁用

  for (const [panelId, isUnread] of unreadEntires) {
    if (isUnread === true) {
      hasUnread = true;

      if (isGroupMuted) {
        // 如果群组已经被静音，则无需做后续判断，跳出循环
        break;
      }

      if (panelId && !mutedList.includes(panelId)) {
        // 如果面板没有并禁言，且有未读消息
        hasUnmutedUnread = true;
        break;
      }
    }
  }

  if (hasUnread) {
    if (hasUnmutedUnread) {
      return 'unread'; // 有未读消息，显示红点
    } else {
      return 'muted'; // 有未读消息，但是未读消息均被静音，显示灰点
    }
  } else {
    return 'none'; // 没有未读消息，不显示任何状态
  }
}
