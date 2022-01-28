import { AppWishResult } from 'genshin-gacha-kit';
import React from 'react';
import { WishResultText } from './WishResultText';

interface GachaResultProps {
  gachaResult: AppWishResult;
}
export const GachaResult: React.FC<GachaResultProps> = React.memo((props) => {
  const { gachaResult } = props;

  return (
    <div>
      <div>
        <WishResultText label="5星" items={gachaResult.ssr} />
      </div>
      <div>
        <WishResultText label="4星" items={gachaResult.sr} />
      </div>
      <div>
        <WishResultText label="3星" items={gachaResult.r} />
      </div>
    </div>
  );
});
GachaResult.displayName = 'GachaResult';
