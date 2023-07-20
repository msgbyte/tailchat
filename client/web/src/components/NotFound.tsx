import React from 'react';
import { Empty } from 'antd';
import { t } from 'tailchat-shared';

interface NotFoundProps {
  message?: string;
}

/**
 * 没有数据或没找到数据
 */
export const NotFound: React.FC<NotFoundProps> = React.memo((props) => {
  return <Empty description={props.message ?? t('未找到内容')} />;
});
NotFound.displayName = 'NotFound';
