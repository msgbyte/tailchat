import { useGlobalKeyDown } from '@/hooks/useGlobalKeyDown';
import { isAlphabetHotkey, isSpaceHotkey } from '@/utils/hot-key';
import React, { useState } from 'react';
import { t, useEvent } from 'tailchat-shared';
import type {
  ChatInputPasteHandler,
  ChatInputPasteHandlerContext,
  ChatInputPasteHandlerData,
} from './clipboard-helper';

export function usePasteHandler() {
  const [inner, setInner] = useState<React.ReactNode>(null);

  useGlobalKeyDown((e) => {
    if (inner === null) {
      return;
    }

    if (isAlphabetHotkey(e) || isSpaceHotkey(e)) {
      setInner(null);
    }
  });

  const runPasteHandlers = useEvent(
    (
      handlers: ChatInputPasteHandler[],
      event: React.ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>,
      context: ChatInputPasteHandlerContext
    ) => {
      const clipboardData = event.clipboardData;
      const data: ChatInputPasteHandlerData = {
        files: clipboardData.files,
        text: clipboardData.getData('text/plain'),
      }; // for get data later, because event is sync

      if (handlers.length === 1) {
        console.log(`Running paste handler: ${handlers[0].name}`);
        event.stopPropagation();
        event.preventDefault();
        handlers[0].handler(data, context);
      } else if (handlers.length >= 2) {
        // 弹出popup
        setInner(
          <div className="absolute bottom-2 bg-content-light bg-opacity-90 dark:bg-content-dark dark:bg-opacity-90 border dark:border-gray-900 shadow rounded px-2 py-1 space-y-1 w-72">
            <div>
              {t(
                '看起来有多个剪切板处理工具被同时匹配，请选择其中一项或者忽略'
              )}
            </div>
            {handlers.map((h) => (
              <div
                key={h.name}
                className="bg-black bg-opacity-40 hover:bg-opacity-80 rounded px-2 py-1 cursor-pointer"
                onClick={() => {
                  console.log(`Running paste handler: ${h.name}`);
                  h.handler(data, context);
                  setInner(null);
                }}
              >
                {h.label}
              </div>
            ))}
          </div>
        );
      }
    }
  );

  const pasteHandlerContainer = <div className="absolute top-0">{inner}</div>;

  return { runPasteHandlers, pasteHandlerContainer };
}
