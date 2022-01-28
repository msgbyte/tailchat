import { ModalWrapper } from '@capital/common';
import { AppGachaItem } from 'genshin-gacha-kit';
import React from 'react';
import { GachaResult } from './GachaResult';

export const WishResultModal: React.FC<{ items: AppGachaItem[] }> = React.memo(
  ({ items }) => {
    return (
      <ModalWrapper title="抽卡结果">
        <GachaResult
          gachaResult={{
            ssr: items.filter((i) => i.rarity === 5),
            sr: items.filter((i) => i.rarity === 4),
            r: items.filter((i) => i.rarity === 3),
          }}
        />
      </ModalWrapper>
    );
  }
);
WishResultModal.displayName = 'WishResultModal';
