import { IconBtn } from '@/components/IconBtn';
import { UserListItem } from '@/components/UserListItem';
import { Tooltip } from 'antd';
import { FriendRequest, t } from 'pawchat-shared';
import React from 'react';

export const RequestReceived: React.FC<{
  requests: FriendRequest[];
}> = React.memo((props) => {
  return (
    <div className="py-2.5 px-5">
      <div>等待处理的好友请求</div>
      <div>
        {props.requests.map(({ from }) => (
          <UserListItem
            key={from}
            userId={from}
            actions={[
              <Tooltip key="accept" title={t('接受')}>
                <div>
                  <IconBtn icon="mdi-check" />
                </div>
              </Tooltip>,
              <Tooltip key="deny" title={t('拒绝')}>
                <div>
                  <IconBtn icon="mdi-close" />
                </div>
              </Tooltip>,
            ]}
          />
        ))}
      </div>
    </div>
  );
});
RequestReceived.displayName = 'RequestReceived';
