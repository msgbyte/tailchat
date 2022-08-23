import { OfficialGachaPoolItem } from 'genshin-gacha-kit';
import React from 'react';

export const GachaPoolItem: React.FC<{
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
