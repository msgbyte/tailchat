import { AppGachaItem } from 'genshin-gacha-kit';
import { getAppGachaItemText } from '../utils';
import React from 'react';

function pickName(item: AppGachaItem) {
  return item.name;
}

export const WishResultText: React.FC<{
  label: string;
  items: AppGachaItem[];
  withCount: boolean;
}> = React.memo(({ label, items, withCount }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <span>
      {label}:{' '}
      {items.map(withCount ? getAppGachaItemText : pickName).join(', ')}
    </span>
  );
});
WishResultText.displayName = 'WishResultText';
