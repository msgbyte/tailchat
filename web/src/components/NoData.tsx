import React from 'react';
import { Empty } from 'antd';

interface NoDataProps {
  message?: string;
}

/**
 * 没有数据或没找到数据
 */
export const NoData: React.FC<NoDataProps> = React.memo((props) => {
  return <Empty description={props.message} />;
});
NoData.displayName = 'NoData';
