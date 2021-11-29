import React from 'react';
import { Loadable } from '../Loadable';

const Emoji = Loadable(
  () =>
    import(/* webpackChunkName: 'emoji' */ /* webpackPreload: true */ './Emoji')
);

const EmojiPicker = Loadable(
  () =>
    import(
      /* webpackChunkName: 'emoji-picker' */ /* webpackPreload: true */ './Picker'
    )
);

export { Emoji };

/**
 * emoji表情面板
 */
export const EmojiPanel: React.FC<{
  onSelect: (code: string) => void;
}> = React.memo((props) => {
  return <EmojiPicker onSelect={props.onSelect} />;
});
EmojiPanel.displayName = 'EmojiPanel';
