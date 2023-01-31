import React from 'react';
import { init } from 'emoji-mart';
import { emojiData } from './const';

init({ set: 'twitter', data: emojiData });

interface Props {
  size?: number;
  emoji: string;
}
export const Emoji: React.FC<Props> = React.memo((props) => {
  const code = props.emoji.startsWith(':') ? props.emoji : `:${props.emoji}:`; // 对旧版兼容

  // @ts-ignore
  return <em-emoji set="twitter" size={16} shortcodes={code}></em-emoji>;
});
Emoji.displayName = 'Emoji';
