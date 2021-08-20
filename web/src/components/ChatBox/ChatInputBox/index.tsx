import { isEnterHotkey } from '@/utils/hot-key';
import { Input } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import { t } from 'tailchat-shared';

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

  return (
    <div className="px-4 py-2">
      <Input
        ref={inputRef}
        className="outline-none shadow-none border-0 bg-gray-600 py-2.5 px-4 rounded-md"
        placeholder={t('输入一些什么')}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
});
ChatInputBox.displayName = 'ChatInputBox';
