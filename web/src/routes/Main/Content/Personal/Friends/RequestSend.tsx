import { IconBtn } from '@/components/IconBtn';
import { UserListItem } from '@/components/UserListItem';
import { Tooltip } from 'antd';
import {
  cancelFriendRequest,
  FriendRequest,
  t,
  useAsyncFn,
} from 'tailchat-shared';
import React from 'react';
import { Problem } from '@/components/Problem';

export const RequestSend: React.FC<{
  requests: FriendRequest[];
}> = React.memo((props) => {
  const [{ loading }, handleCancel] = useAsyncFn(async (requestId) => {
    await cancelFriendRequest(requestId);
  }, []);

  if (props.requests.length === 0) {
    return <Problem text={t('暂无已发送的好友请求')} />;
  }

  return (
    <div className="py-2.5 px-5">
      <div>{t('等待对方处理的好友请求')}:</div>
      <div>
        {props.requests.map(({ _id, to }) => (
          <UserListItem
            key={to}
            userId={to}
            actions={[
              <Tooltip key="cancel" title={t('取消')}>
                <div>
                  <IconBtn
                    icon="mdi:close"
                    disabled={loading}
                    onClick={() => handleCancel(_id)}
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
RequestSend.displayName = 'RequestSend';
