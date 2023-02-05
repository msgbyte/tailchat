import React from 'react';
import { t } from 'tailchat-shared';
import { FileCard, FileCardPayload } from './FileCard';
import { CardWrapper } from './Wrapper';

interface Props {
  type: 'file';
  payload: FileCardPayload;
}
export const Card: React.FC<Props> = React.memo((props) => {
  if (props.type === 'file') {
    return <FileCard payload={props.payload} />;
  }

  return <CardWrapper>{t('未知的卡片类型')}</CardWrapper>;
});
Card.displayName = 'Card';
