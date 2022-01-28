import { AppGachaItem } from 'genshin-gacha-kit';
import { getAppGachaItemText } from '../utils';
import React from 'react';

export const WishResultText: React.FC<{
  label: string;
  items: AppGachaItem[];
}> = React.memo(({ label, items }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <span>
      {label}: {items.map(getAppGachaItemText).join(',')}
    </span>
  );
});
WishResultText.displayName = 'WishResultText';
