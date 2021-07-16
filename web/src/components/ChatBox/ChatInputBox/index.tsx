import { Input } from 'antd';
import React from 'react';

interface ChatInputBoxProps {
  onSendMsg: (msg: string) => void;
}
export const ChatInputBox: React.FC<ChatInputBoxProps> = React.memo((props) => {
  return (
    <div>
      <Input onPressEnter={(e) => props.onSendMsg(e.currentTarget.value)} />
    </div>
  );
});
ChatInputBox.displayName = 'ChatInputBox';
