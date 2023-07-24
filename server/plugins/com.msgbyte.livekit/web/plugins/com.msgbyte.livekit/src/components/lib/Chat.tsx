import type {
  ChatMessage,
  ReceivedChatMessage,
} from '@livekit/components-core';
import { setupChat } from '@livekit/components-core';
import {
  ChatEntry,
  MessageFormatter,
  useRoomContext,
} from '@livekit/components-react';
import * as React from 'react';
import { Translate } from '../../translate';
import { cloneSingleChild } from '../../utils/common';
import { useObservableState } from '../../utils/useObservableState';
// import { useRoomContext } from '../context';
// import { useObservableState } from '../hooks/internal/useObservableState';
// import { cloneSingleChild } from '../utils';
// import type { MessageFormatter } from '../components/ChatEntry';
// import { ChatEntry } from '../components/ChatEntry';

export type { ChatMessage, ReceivedChatMessage };

/** @public */
export interface ChatProps extends React.HTMLAttributes<HTMLDivElement> {
  messageFormatter?: MessageFormatter;
}

/** @public */
export function useChat() {
  const room = useRoomContext();
  const [setup, setSetup] = React.useState<ReturnType<typeof setupChat>>();
  const isSending = useObservableState(setup?.isSendingObservable, false);
  const chatMessages = useObservableState(setup?.messageObservable, []);

  React.useEffect(() => {
    const setupChatReturn = setupChat(room);
    setSetup(setupChatReturn);
    return setupChatReturn.destroy;
  }, [room]);

  return { send: setup?.send, chatMessages, isSending };
}

/**
 * The Chat component adds a basis chat functionality to the LiveKit room. The messages are distributed to all participants
 * in the room. Only users who are in the room at the time of dispatch will receive the message.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <Chat />
 * </LiveKitRoom>
 * ```
 * @public
 */
export function Chat({ messageFormatter, ...props }: ChatProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const ulRef = React.useRef<HTMLUListElement>(null);
  const { send, chatMessages, isSending } = useChat();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (inputRef.current && inputRef.current.value.trim() !== '') {
      if (send) {
        await send(inputRef.current.value);
        inputRef.current.value = '';
        inputRef.current.focus();
      }
    }
  }

  React.useEffect(() => {
    if (ulRef) {
      ulRef.current?.scrollTo({ top: ulRef.current.scrollHeight });
    }
  }, [ulRef, chatMessages]);

  return (
    <div {...props} className="lk-chat">
      <ul className="lk-list lk-chat-messages" ref={ulRef}>
        {props.children
          ? chatMessages.map((msg, idx) =>
              cloneSingleChild(props.children, {
                entry: msg,
                key: idx,
                messageFormatter,
              })
            )
          : chatMessages.map((msg, idx, allMsg) => {
              const hideName = idx >= 1 && allMsg[idx - 1].from === msg.from;
              // If the time delta between two messages is bigger than 60s show timestamp.
              const hideTimestamp =
                idx >= 1 && msg.timestamp - allMsg[idx - 1].timestamp < 60_000;

              return (
                <ChatEntry
                  key={idx}
                  hideName={hideName}
                  hideTimestamp={hideName === false ? false : hideTimestamp} // If we show the name always show the timestamp as well.
                  entry={msg}
                  messageFormatter={messageFormatter}
                />
              );
            })}
      </ul>
      <form className="lk-chat-form" onSubmit={handleSubmit}>
        <input
          className="lk-form-control lk-chat-form-input"
          disabled={isSending}
          ref={inputRef}
          type="text"
          placeholder={Translate.enterMessage}
        />
        <button
          type="submit"
          className="lk-button lk-chat-form-button"
          disabled={isSending}
        >
          {Translate.send}
        </button>
      </form>
    </div>
  );
}
