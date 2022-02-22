import { UserListItem } from '@/components/UserListItem';
import { getMessageTextDecorators } from '@/plugin/common';
import React from 'react';
import { Mention, MentionsInput } from 'react-mentions';
import { t } from 'tailchat-shared';
import { useChatInputMentionsContext } from './context';

import './input.less';

interface ChatInputBoxInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    'value' | 'onChange'
  > {
  inputRef?: React.Ref<HTMLInputElement>;
  value: string;
  onChange: (message: string) => void;
}
export const ChatInputBoxInput: React.FC<ChatInputBoxInputProps> = React.memo(
  (props) => {
    const mentions = useChatInputMentionsContext();

    return (
      <MentionsInput
        inputRef={props.inputRef}
        className="chatbox-mention-input"
        placeholder={t('输入一些什么')}
        singleLine={true}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        onKeyDown={props.onKeyDown}
        onPaste={props.onPaste}
        allowSuggestionsAboveCursor={true}
        forceSuggestionsAboveCursor={true}
      >
        <Mention
          trigger="@"
          data={mentions.users}
          displayTransform={(id, display) => `@${display}`}
          appendSpaceOnAdd={true}
          renderSuggestion={(suggestion) => (
            <UserListItem userId={String(suggestion.id)} />
          )}
          markup={getMessageTextDecorators().mention('__id__', '__display__')}
        />
      </MentionsInput>
    );
  }
);
ChatInputBoxInput.displayName = 'ChatInputBoxInput';
