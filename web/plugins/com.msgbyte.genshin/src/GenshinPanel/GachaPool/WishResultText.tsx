import { AppGachaItem } from 'genshin-gacha-kit';
import { getAppGachaItemText } from '../utils';
import React from 'react';

export const WishResultText: React.FC<{ items: AppGachaItem[] }> = React.memo(
  ({ items }) => {
    return <span>{items.map(getAppGachaItemText).join(',')}</span>;
  }
);
WishResultText.displayName = 'WishResultText';
