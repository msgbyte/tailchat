import { useAsync } from '@capital/common';
import { Divider, Button, Space } from '@capital/component';
import React from 'react';
import { util } from 'genshin-gacha-kit';
import { GenshinRichtext } from '../../components/GenshinRichtext';
import { GachaPoolItem } from './GachaPoolItem';
import { useWish } from './useWish';
import { GachaResult } from './GachaResult';

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

      <Space>
        <Button type="primary" onClick={() => handleGacha(1)}>
          模拟单抽
        </Button>
        <Button type="primary" onClick={() => handleGacha(10)}>
          模拟十连
        </Button>
      </Space>

      {gachaCount > 0 && (
        <div>
          <div>已抽: {gachaCount} 次</div>

          <GachaResult gachaResult={gachaResult} />
        </div>
      )}

      <Divider />

      <GenshinRichtext raw={poolData.content} />
    </div>
  );
});
GachaPool.displayName = 'GachaPool';
