import React from 'react';
import { t } from 'tailchat-shared';
import { FileCard } from './FileCard';
import { CardWrapper } from './Wrapper';
import { pluginCardItemMap } from '@/plugin/common';

interface Props {
  type: string;
  payload: BaseCardPayload;
}
export interface BaseCardPayload {
  [key: string]: any;
}
export const Card: React.FC<Props> = React.memo((props) => {
  if (pluginCardItemMap[props.type]) {
    const info = pluginCardItemMap[props.type];
    const Component = info.render;
    return <Component payload={props.payload} />;
  }

  if (props.type === 'file') {
    return <FileCard payload={props.payload as any} />;
  }

  return <CardWrapper>{t('未知的卡片类型')}</CardWrapper>;
});
Card.displayName = 'Card';
