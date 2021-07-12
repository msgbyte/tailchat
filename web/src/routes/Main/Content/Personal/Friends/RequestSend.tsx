import { IconBtn } from '@/components/IconBtn';
import { UserListItem } from '@/components/UserListItem';
import { Tooltip } from 'antd';
import { FriendRequest, t } from 'pawchat-shared';
import React from 'react';

export const RequestSend: React.FC<{
  requests: FriendRequest[];
}> = React.memo((props) => {
  return (
    <div className="py-2.5 px-5">
      <div>等待对方处理的好友请求</div>
      <div>
        {props.requests.map(({ to }) => (
          <UserListItem
            key={to}
            userId={to}
            actions={[
              <Tooltip key="cancel" title={t('取消')}>
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
RequestSend.displayName = 'RequestSend';
