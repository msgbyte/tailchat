import { useAsync, showToasts } from '@capital/common';
import { Divider, Button } from '@capital/component';
import React, { useCallback, useMemo, useState } from 'react';
import {
  AppGachaItem,
  AppWishResult,
  GenshinGachaKit,
  OfficialGachaPool,
  OfficialGachaPoolItem,
  util,
} from 'genshin-gacha-kit';
import { GenshinRichtext } from '../components/GenshinRichtext';
import { getAppGachaItemText } from './utils';

const GachaPoolItem: React.FC<{
  items: OfficialGachaPoolItem[];
}> = React.memo((props) => {
  return (
    <div>
      {props.items.map((i) => (
        <div key={i.item_id}>
          <img src={i.item_img} />

          <div>{i.item_name}</div>
        </div>
      ))}
    </div>
  );
});
GachaPoolItem.displayName = 'GachaPoolItem';

const WishResult: React.FC<{ items: AppGachaItem[] }> = React.memo(
  ({ items }) => {
    return <span>{items.map(getAppGachaItemText).join(',')}</span>;
  }
);
WishResult.displayName = 'WishResult';

function useWish(poolData: OfficialGachaPool) {
  const [gachaResult, setGachaResult] = useState<AppWishResult>({
    ssr: [],
    sr: [],
    r: [],
  });
  const [gachaCount, setGachaCount] = useState<number>(0);

  const gachaKit = useMemo(() => {
    return poolData
      ? new GenshinGachaKit(util.poolStructureConverter(poolData))
      : null;
  }, [poolData]);
  const handleGacha = useCallback(
    (num) => {
      if (!gachaKit) {
        return;
      }

      const res = gachaKit.multiWish(num);
      showToasts('抽卡结果: ' + res.map((item) => item.name).join(','));

      setGachaCount(gachaKit.getCounter('total') as number);
      setGachaResult(JSON.parse(JSON.stringify(gachaKit.getResult())));
    },
    [gachaKit]
  );

  return { handleGacha, gachaResult, gachaCount };
}

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
            5星: <WishResult items={gachaResult.ssr} />
          </div>
          <div>
            4星: <WishResult items={gachaResult.sr} />
          </div>
          <div>
            3星: <WishResult items={gachaResult.r} />
          </div>
        </div>
      )}

      <Divider />

      <GenshinRichtext raw={poolData.content} />
    </div>
  );
});
GachaPool.displayName = 'GachaPool';
