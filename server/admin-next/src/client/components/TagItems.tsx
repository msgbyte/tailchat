import React from 'react';
import { styled, Tag } from 'tushan';

const Root = styled.div`
  * {
    margin-right: 4px;
    margin-bottom: 4px;
  }
`;

export const TagItems: React.FC<{
  items: string[];
}> = React.memo((props) => {
  return (
    <Root>
      {props.items.map((item, i) => (
        <Tag key={i}>{item}</Tag>
      ))}
    </Root>
  );
});
TagItems.displayName = 'TagItems';
