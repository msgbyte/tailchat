import { isEnterHotkey } from '@/utils/hot-key';
import { Input } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import { t } from 'tailchat-shared';
import { ChatInputAddon } from './Addon';
import { ClipboardHelper } from './clipboard-helper';
import { ChatInputActionContext } from './context';
import { uploadMessageImage } from './utils';

interface ChatInputBoxProps {
  onSendMsg: (msg: string) => void;
}
export const ChatInputBox: React.FC<ChatInputBoxProps> = React.memo((props) => {
  const inputRef = useRef<Input>(null);
  const [message, setMessage] = useState('');
  const handleSendMsg = useCallback(() => {
    props.onSendMsg(message);
    setMessage('');
    inputRef.current?.focus();
  }, [message]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isEnterHotkey(e.nativeEvent)) {
        e.preventDefault();
        handleSendMsg();
      }
    },
    [handleSendMsg]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      const helper = new ClipboardHelper(e);
      const image = helper.hasImage();
      if (image) {
        // 上传图片
        e.preventDefault();
        uploadMessageImage(image).then(({ url, width, height }) => {
          // TODO: not good, should bind with plugin bbcode
          props.onSendMsg(`[img width=${width} height=${height}]${url}[/img]`);
        });
      }
    },
    [props.onSendMsg]
  );

  return (
    <ChatInputActionContext.Provider value={{ sendMsg: props.onSendMsg }}>
      <div className="px-4 py-2">
        <div className="bg-white dark:bg-gray-600 flex rounded-md items-center">
          <Input
            ref={inputRef}
            className="outline-none shadow-none border-0 py-2.5 px-4 flex-1"
            placeholder={t('输入一些什么')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
