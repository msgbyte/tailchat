import { useAppDispatch, useAppSelector } from './useAppSelector';
import { chatActions } from '../slices';
import { useEvent } from '../../hooks/useEvent';
import { getCachedAckInfo } from '../../cache/cache';

export function useAckInfoChecker() {
  const ack = useAppSelector((state) => state.chat.ack);
  const lastMessageMap = useAppSelector((state) => state.chat.lastMessageMap);
  const dispatch = useAppDispatch();

  const ensureAckInfo = useEvent((converseId: string) => {
    if (
      ack[converseId] === undefined ||
      lastMessageMap[converseId] === undefined
    ) {
      getCachedAckInfo(converseId).then((info) => {
        if (info.ack?.lastMessageId) {
          dispatch(
            chatActions.setConverseAck({
              converseId,
              lastMessageId: info.ack.lastMessageId,
            })
          );
        }

        if (info.lastMessage?.lastMessageId) {
          dispatch(
            chatActions.setLastMessageMap([
              {
                converseId,
                lastMessageId: info.lastMessage.lastMessageId,
              },
            ])
          );
        }
      });
    }
  });

  return { ensureAckInfo };
}
