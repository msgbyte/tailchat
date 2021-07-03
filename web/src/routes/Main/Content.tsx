import React from 'react';
import { PillTabs, PillTabPane } from '../../components/PillTabs';
import { useAppSelector } from '../../hooks/useAppSelector';

/**
 * 主要内容组件
 */
export const Content: React.FC = React.memo(() => {
  const friends = useAppSelector((state) => state.user.friends);

  return (
    <div className="flex-auto bg-gray-700">
      <PillTabs>
        <PillTabPane tab={'全部'} key="1">
          <div className="py-2.5 px-5">
            <div>好友列表</div>
            <div>{JSON.stringify(friends)}</div>
          </div>
        </PillTabPane>
      </PillTabs>
    </div>
  );
});
Content.displayName = 'Content';
