import { getMessageTextDecorators } from '@/plugin/common';
import { isEnterHotkey } from '@/utils/hot-key';
import React, { useCallback, useRef, useState } from 'react';
import { ChatInputAddon } from './Addon';
import { ClipboardHelper } from './clipboard-helper';
import { ChatInputActionContext } from './context';
import { uploadMessageImage } from './utils';
import { ChatInputBoxInput } from './input';
import {
  getCachedUserInfo,
  isValidStr,
  SendMessagePayloadMeta,
  useSharedEventHandler,
} from 'tailchat-shared';

interface ChatInputBoxProps {
  onSendMsg: (msg: string, meta?: SendMessagePayloadMeta) => void;
}
export const ChatInputBox: React.FC<ChatInputBoxProps> = React.memo((props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [mentions, setMentions] = useState<string[]>([]);
  const handleSendMsg = useCallback(() => {
    props.onSendMsg(message, {
      mentions,
    });
    setMessage('');
    inputRef.current?.focus();
  }, [message, mentions]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (isEnterHotkey(e.nativeEvent)) {
        e.preventDefault();
        handleSendMsg();
      }
    },
    [handleSendMsg]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement | HTMLTextAreaElement>) => {
      const helper = new ClipboardHelper(e);
      const image = helper.hasImage();
      if (image) {
        // 上传图片
        e.preventDefault();
        uploadMessageImage(image).then(({ url, width, height }) => {
          props.onSendMsg(
            getMessageTextDecorators().image(url, { width, height })
          );
        });
      }
    },
    [props.onSendMsg]
  );

  useSharedEventHandler('replyMessage', async (payload) => {
    if (inputRef.current) {
      inputRef.current.focus();
      console.log(payload);
      if (payload && isValidStr(payload?.author)) {
        const userInfo = await getCachedUserInfo(payload.author);
        setMessage(
          `${getMessageTextDecorators().mention(
            payload.author,
            userInfo.nickname
          )} ${message}`
        );
      }
    }
  });

  return (
    <ChatInputActionContext.Provider value={{ sendMsg: props.onSendMsg }}>
      <div className="px-4 py-2">
        <div className="bg-white dark:bg-gray-600 flex rounded-md items-center">
          <ChatInputBoxInput
            inputRef={inputRef}
            value={message}
            onChange={(message, mentions) => {
              setMessage(message);
              setMentions(mentions);
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />

          <div className="px-2">
            <ChatInputAddon />
          </div>
        </div>
      </div>
    </ChatInputActionContext.Provider>
  );
});
ChatInputBox.displayName = 'ChatInputBox';
