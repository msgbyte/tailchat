import { useAsync } from '@capital/common';
import { Divider } from '@capital/component';
import React from 'react';
import { OfficialGachaPoolItem, util } from 'genshin-gacha-kit';

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

export const GachaPool: React.FC<{
  gachaId: string;
}> = React.memo((props) => {
  const { value: poolData } = useAsync(() => {
    return util.getGachaData(props.gachaId);
  }, [props.gachaId]);

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

      <Divider />

      <div>{poolData.content}</div>
    </div>
  );
});
GachaPool.displayName = 'GachaPool';
