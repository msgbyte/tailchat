import { EmojiPanel } from '@/components/Emoji';
import { useTcPopoverContext } from '@/components/TcPopover';
import type { RenderFunction } from 'antd/lib/_util/getRenderPropValue';
import React, { useMemo } from 'react';
import {
  addReaction,
  ChatMessage,
  useAsyncRequest,
  useUpdateRef,
} from 'tailchat-shared';

/**
 * 消息的反应信息操作
 */
export function useChatMessageReaction(payload: ChatMessage): RenderFunction {
  const payloadRef = useUpdateRef(payload);
  const Component = useMemo(
    () =>
      (() => {
        const { closePopover } = useTcPopoverContext();

        const [, handleSelect] = useAsyncRequest(async (code: string) => {
          await addReaction(payloadRef.current._id, code);
          closePopover();
        }, []);

        return <EmojiPanel onSelect={handleSelect} />;
      }) as RenderFunction,
    []
  );

  return Component;
}
