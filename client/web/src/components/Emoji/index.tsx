import React from 'react';
import { EmojiPicker } from './Picker';
export { Emoji } from './Emoji';

/**
 * emoji表情面板
 */
export const EmojiPanel: React.FC<{
  onSelect: (code: string) => void;
}> = React.memo((props) => {
  return <EmojiPicker onSelect={props.onSelect} />;
});
EmojiPanel.displayName = 'EmojiPanel';
