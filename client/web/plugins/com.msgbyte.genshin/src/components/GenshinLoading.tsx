import React from 'react';
import './GenshinLoading.less';

export const GenshinLoading: React.FC = React.memo(() => {
  return (
    <div
      className="plugin-genshin-loading-bar"
      role="presentation"
      aria-hidden="true"
    >
      <img src="https://yuanshen.site/imgs/loading-bar.png" alt="Loading..." />
    </div>
  );
});
GenshinLoading.displayName = 'GenshinLoading';
