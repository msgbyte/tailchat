import type { InboxStruct, MessageMetaStruct } from './chat';

/**
 * 默认服务的事件映射
 */
export interface BuiltinEventMap {
  'gateway.auth.addWhitelists': { urls: string[] };
  'chat.message.updateMessage':
    | {
        type: 'add';
        groupId?: string;
        converseId: string;
        messageId: string;
        author: string;
        content: string;
        plain?: string;
        meta: MessageMetaStruct;
      }
    | {
        type: 'recall' | 'delete';
        groupId?: string;
        converseId: string;
        messageId: string;
        meta: MessageMetaStruct;
      };
  'config.updated': { config: Record<string, any> };
  'chat.inbox.append': InboxStruct;
}
