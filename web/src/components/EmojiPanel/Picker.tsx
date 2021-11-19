import React, { useCallback } from 'react';
import { NimblePicker, EmojiData } from 'emoji-mart';
import { isValidStr, useColorScheme } from 'tailchat-shared';
import { emojiData } from './const';

import 'emoji-mart/css/emoji-mart.css';
import './Picker.less';

interface EmojiPickerProps {
  onSelect: (code: string) => void;
}

/**
 * emoji表情面板
 */
const EmojiPicker: React.FC<EmojiPickerProps> = React.memo((props) => {
  const { isDarkMode } = useColorScheme();
  const handleSelect = useCallback(
    (emoji: EmojiData) => {
      const code = emoji.colons;
      if (isValidStr(code)) {
        props.onSelect(code);
      }
    },
    [props.onSelect]
  );

  return (
    <div className="emoji-picker">
      <NimblePicker
        set="twitter"
        data={emojiData}
        theme={isDarkMode ? 'dark' : 'light'}
        showPreview={false}
        showSkinTones={false}
        emojiTooltip={false}
        onSelect={handleSelect}
      />
    </div>
  );
});
EmojiPicker.displayName = 'EmojiPicker';

export default EmojiPicker;
