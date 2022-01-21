import { Emoji as OriginEmoji, EmojiProps } from 'emoji-mart';
import React from 'react';

interface Props extends Omit<EmojiProps, 'size'> {
  size?: number;
}
const Emoji: React.FC<Props> = React.memo((props) => {
  return <OriginEmoji set="twitter" size={16} {...props} />;
});
Emoji.displayName = 'Emoji';

export default Emoji;
