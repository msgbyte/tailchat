import { IconBtn } from '@/components/IconBtn';
import { UserListItem } from '@/components/UserListItem';
import { Tooltip } from 'antd';
import {
  FriendRequest,
  t,
  acceptFriendRequest,
  denyFriendRequest,
  useAsyncRequest,
} from 'tailchat-shared';
import React from 'react';

export const RequestReceived: React.FC<{
  requests: FriendRequest[];
}> = React.memo((props) => {
  const [{ loading: acceptLoading }, handleAccept] = useAsyncRequest(
    async (requestId) => {
      await acceptFriendRequest(requestId);
    },
    []
  );

  const [{ loading: denyLoading }, handleDeny] = useAsyncRequest(
    async (requestId) => {
      await denyFriendRequest(requestId);
    },
    []
  );

  const loading = acceptLoading || denyLoading;

  return (
    <div className="py-2.5 px-5">
      <div>{t('等待处理的好友请求')}:</div>
      <div>
        {props.requests.map(({ _id, from }) => (
          <UserListItem
            key={from}
            userId={from}
            actions={[
              <Tooltip key="accept" title={t('接受')}>
                <div>
                  <IconBtn
                    icon="mdi:check"
                    disabled={loading}
                    onClick={() => handleAccept(_id)}
                  />
                </div>
              </Tooltip>,
              <Tooltip key="deny" title={t('拒绝')}>
                <div>
                  <IconBtn
                    icon="mdi:close"
                    disabled={loading}
                    onClick={() => handleDeny(_id)}
                  />
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
