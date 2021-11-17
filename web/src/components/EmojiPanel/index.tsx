import React from 'react';
import { Loadable } from '../Loadable';

const EmojiPicker = Loadable(
  () =>
    import(
      /* webpackChunkName: 'emoji-picker' */ /* webpackPrefetch: true */ './Picker'
    )
);

/**
 * emoji表情面板
 */
export const EmojiPanel: React.FC<{
  onSelect: (code: string) => void;
}> = React.memo((props) => {
  return <EmojiPicker onSelect={props.onSelect} />;
});
EmojiPanel.displayName = 'EmojiPanel';
