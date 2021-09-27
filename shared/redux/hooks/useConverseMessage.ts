import { useCallback, useEffect } from 'react';
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
import { useChatBoxContext } from '../..';
import { MessageHelper } from '../../utils/message-helper';
import { ChatConverseType } from '../../model/converse';

function useHandleSendMessage(context: ConverseContext) {
  const { converseId } = context;
  const dispatch = useAppDispatch();
  const { hasContext, replyMsg, clearReplyMsg } = useChatBoxContext();

  /**
   * 发送消息
   */
  const handleSendMessage = useCallback(
    async (payload: SendMessagePayload) => {
      try {
        if (hasContext === true) {
          // 如果有上下文, 则组装payload
          const msgHelper = new MessageHelper(payload);
          if (!_isNil(replyMsg)) {
            msgHelper.setReplyMsg(replyMsg);
            clearReplyMsg();
          }

          payload = msgHelper.generatePayload();
        }

        // TODO: 增加临时消息, 对网络环境不佳的状态进行优化

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
    },
    [converseId, hasContext, replyMsg, clearReplyMsg]
  );

  return handleSendMessage;
}

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

  useEffect(() => {
    dispatch(chatActions.updateCurrentConverseId(converseId));

    return () => {
      dispatch(chatActions.updateCurrentConverseId(null));
    };
  }, [converseId]);

  // NOTICE: 该hook只会在converseId变化时执行
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
            type: ChatConverseType.Group,
            members: [],
          })
        );
      }

      // Step 2. 拉取消息
      const historyMessages = await fetchConverseMessage(converseId);
      dispatch(
        chatActions.initialHistoryMessage({
          converseId,
          historyMessages,
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
  }, [converseId]);

  const handleSendMessage = useHandleSendMessage(context);

  return { messages, loading, error, handleSendMessage };
}
