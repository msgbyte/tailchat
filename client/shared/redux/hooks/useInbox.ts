import type { InboxItem } from '../../model/inbox';
import { useAppSelector } from './useAppSelector';

/**
 * 返回收件箱列表
 */
export function useInboxList(): InboxItem[] {
  return useAppSelector((state) => state.chat.inbox ?? []);
}

/**
 * 返回收件箱某一项的值
 */
export function useInboxItem(inboxItemId: string): InboxItem | null {
  const list = useInboxList();

  return list.find((item) => item._id === inboxItemId) ?? null;
}
