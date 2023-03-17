import React, { useMemo } from 'react';
import { init, Data, SearchIndex } from 'emoji-mart';
import { emojiData } from './const';
import spritesUrl from './twitter.png';

init({ set: 'twitter', data: emojiData });

interface Props {
  size?: number;
  emoji: string;
}

// Fork from https://github.com/missive/emoji-mart/blob/main/packages/emoji-mart/src/components/Emoji/Emoji.tsx
export const Emoji: React.FC<Props> = React.memo((props) => {
  const code = props.emoji.startsWith(':') ? props.emoji : `:${props.emoji}:`; // 对旧版兼容

  const { emojiSkin } = useMemo(() => {
    let id = '';
    let skin = 0;
    const matches = code.match(SearchIndex.SHORTCODES_REGEX);

    if (matches) {
      id = matches[1];

      if (matches[2]) {
        skin = Number(matches[2]);
      }
    }

    // @ts-ignore
    const emoji = SearchIndex.get(id);
    const emojiSkin = emoji.skins[skin - 1] || emoji.skins[0];

    return {
      emojiSkin,
    };
  }, [code]);

  return (
    <span className="emoji-mart-emoji align-middle" data-emoji-set={'twitter'}>
      <span
        style={{
          display: 'block',
          width: props.size ?? '16px',
          height: props.size ?? '16px',
          backgroundImage: `url(${spritesUrl})`,
          backgroundSize: `${100 * Data.sheet.cols}% ${100 * Data.sheet.rows}%`,
          backgroundPosition: `${
            (100 / (Data.sheet.cols - 1)) * emojiSkin.x
          }% ${(100 / (Data.sheet.rows - 1)) * emojiSkin.y}%`,
        }}
      />
    </span>
  );
});
Emoji.displayName = 'Emoji';
