import { useCallback } from 'react';
import { ensureDMConverse } from '../../helper/converse-helper';
import { useAsync } from '../../hooks/useAsync';
import { showErrorToasts } from '../../manager/ui';
import {
  fetchConverseMessage,
  sendMessage,
  SendMessagePayload,
} from '../../model/message';
import { chatActions } from '../slices';
import { useAppDispatch, useAppSelector } from './useAppSelector';
import _isNil from 'lodash/isNil';

/**
 * 会话消息管理
 */
interface ConverseContext {
  converseId: string;
  isGroup: boolean;
}
export function useConverseMessage(context: ConverseContext) {
  const { converseId, isGroup } = context;
  const converse = useAppSelector((state) => state.chat.converses[converseId]);
  const dispatch = useAppDispatch();
  const messages = converse?.messages ?? [];

  // NOTICE: 该hook只会在第一次执行
  const { loading, error } = useAsync(async () => {
    if (!converse) {
      // 如果是一个新会话(或者当前会话列表中没有)
      if (!isGroup) {
        // 如果是私信会话
        // Step 1. 创建会话 并确保私信列表中存在该会话
        const converse = await ensureDMConverse(converseId);
        dispatch(chatActions.setConverseInfo(converse));
      } else {
        // 如果是群组会话(文本频道)
        // Step 1. 确保群组会话存在
        dispatch(
          chatActions.setConverseInfo({
            _id: converseId,
            name: '',
            type: 'Group',
            members: [],
          })
        );
      }

      // Step 2. 拉取消息
      const messages = await fetchConverseMessage(converseId);
      dispatch(
        chatActions.initialHistoryMessage({
          converseId,
          historyMessages: messages,
        })
      );
    } else {
      // 已存在会话
      if (!converse.hasFetchedHistory) {
        // 没有获取过历史消息
        // 拉取历史消息
        const startId = _isNil(converse.messages[0])
          ? undefined
          : converse.messages[0]._id;
        const messages = await fetchConverseMessage(converseId, startId);
        dispatch(
          chatActions.initialHistoryMessage({
            converseId,
            historyMessages: messages,
          })
        );
      }
    }
  }, []);

  const handleSendMessage = useCallback(async (payload: SendMessagePayload) => {
    // TODO: 增加临时消息, 对网络环境不佳的状态进行优化

    try {
      const message = await sendMessage(payload);
      dispatch(
        chatActions.appendConverseMessage({
          converseId,
          messages: [message],
        })
      );
    } catch (err) {
      showErrorToasts(err);
    }
  }, []);

  return { messages, loading, error, handleSendMessage };
}
