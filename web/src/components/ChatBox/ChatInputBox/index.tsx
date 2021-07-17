import { Input } from 'antd';
import React from 'react';

interface ChatInputBoxProps {
  onSendMsg: (msg: string) => void;
}
export const ChatInputBox: React.FC<ChatInputBoxProps> = React.memo((props) => {
  return (
    <div className="px-4 pb-2">
      <Input
        className="outline-none shadow-none border-0 bg-gray-600 py-2.5 px-4 rounded-md"
        placeholder="输入一些什么"
        onPressEnter={(e) => props.onSendMsg(e.currentTarget.value)}
      />
    </div>
  );
});
ChatInputBox.displayName = 'ChatInputBox';
