import type { InboxItem } from '../../model/inbox';
import { useAppSelector } from './useAppSelector';

/**
 * 返回收件箱列表
 */
export function useInboxList(): InboxItem[] {
  return useAppSelector((state) => state.chat.inbox ?? []);
}
