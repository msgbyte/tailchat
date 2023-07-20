import { OfficialGachaPoolItem } from 'genshin-gacha-kit';
import React from 'react';
import styled from 'styled-components';

const ItemRoot = styled.div`
  position: relative;

  .text {
    position: absolute;
    bottom: 0;
    color: #444;
    font-size: 24px;
    width: 100%;
    text-align: center;
    font-weight: bold;
    line-height: 44px;
  }
`;

export const GachaPoolItem: React.FC<{
  items: OfficialGachaPoolItem[];
}> = React.memo((props) => {
  return (
    <div>
      {props.items.map((i) => (
        <ItemRoot key={i.item_id}>
          <img src={i.item_img} />

          <div className="text">{i.item_name}</div>
        </ItemRoot>
      ))}
    </div>
  );
});
GachaPoolItem.displayName = 'GachaPoolItem';
