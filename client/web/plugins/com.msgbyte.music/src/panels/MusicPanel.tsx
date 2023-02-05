import React from 'react';
import { WebviewKeepAlive } from '@capital/component';

const url = 'https://music.moonrailgun.com/';

/**
 * 音乐面板
 */
export const MusicPanel: React.FC = React.memo(() => {
  return (
    <WebviewKeepAlive key={String(url)} className="w-full h-full" url={url} />
  );
});
MusicPanel.displayName = 'MusicPanel';
