import { EmojiPanel } from '@/components/EmojiPanel';
import { useTcPopoverContext } from '@/components/TcPopover';
import type { RenderFunction } from 'antd/lib/_util/getRenderPropValue';
import React, { useCallback, useMemo } from 'react';
import { ChatMessage, useUpdateRef } from 'tailchat-shared';

/**
 * 消息的反应信息操作
 */
export function useChatMessageReaction(payload: ChatMessage): RenderFunction {
  const payloadRef = useUpdateRef(payload);
  const Component = useMemo(
    () =>
      (() => {
        const { closePopover } = useTcPopoverContext();

        const handleSelect = useCallback((code: string) => {
          console.log('code', code, payloadRef.current);
          closePopover();
        }, []);

        return <EmojiPanel onSelect={handleSelect} />;
      }) as RenderFunction,
    []
  );

  return Component;
}
