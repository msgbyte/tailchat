import { useAsync } from '@capital/common';
import { Divider, Button } from '@capital/component';
import React from 'react';
import { util } from 'genshin-gacha-kit';
import { GenshinRichtext } from '../../components/GenshinRichtext';
import { WishResultText } from './WishResultText';
import { GachaPoolItem } from './GachaPoolItem';
import { useWish } from './useWish';

export const GachaPool: React.FC<{
  gachaId: string;
}> = React.memo((props) => {
  const { value: poolData } = useAsync(() => {
    return util.getGachaData(props.gachaId);
  }, [props.gachaId]);
  const { handleGacha, gachaResult, gachaCount } = useWish(poolData);

  if (!poolData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>{poolData.banner}</div>

      <div>{poolData.date_range}</div>
      <div className="gacha-pool">
        <GachaPoolItem items={poolData.r5_up_items ?? []} />
        <GachaPoolItem items={poolData.r4_up_items ?? []} />
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        <Button type="primary" onClick={() => handleGacha(1)}>
          模拟单抽
        </Button>
        <Button type="primary" onClick={() => handleGacha(10)}>
          模拟十连
        </Button>
      </div>

      {gachaCount > 0 && (
        <div>
          <div>已抽: {gachaCount} 次</div>

          <div>
            5星: <WishResultText items={gachaResult.ssr} />
          </div>
          <div>
            4星: <WishResultText items={gachaResult.sr} />
          </div>
          <div>
            3星: <WishResultText items={gachaResult.r} />
          </div>
        </div>
      )}

      <Divider />

      <GenshinRichtext raw={poolData.content} />
    </div>
  );
});
GachaPool.displayName = 'GachaPool';
