import { Button, Divider } from 'antd';
import React, { useCallback } from 'react';
import { useHistory, useParams } from 'react-router';
import { InviteInfo } from './InviteInfo';
import bgImage from '@assets/images/bg.jpg';
import { t } from 'tailchat-shared';

/**
 * 邀请界面路由
 */
export const InviteRoute: React.FC = React.memo(() => {
  const history = useHistory();
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const isLogin = true;

  const handleRegister = useCallback(() => {
    history.push(
      `/entry/register?redirect=${encodeURIComponent(location.pathname)}`
    );
  }, []);

  const handleJoinGroup = useCallback(() => {
    // TODO
    console.log('TODO');
  }, []);

  return (
    <div
      className="h-full w-full bg-gray-600 flex justify-center items-center bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-96 p-4 rounded-lg shadow-lg bg-black bg-opacity-60 text-center">
        <InviteInfo inviteCode={inviteCode} />

        <Divider />

        {isLogin ? (
          <Button
            block={true}
            type="primary"
            size="large"
            onClick={handleJoinGroup}
          >
            {t('加入群组')}
          </Button>
        ) : (
          <Button
            block={true}
            type="primary"
            size="large"
            onClick={handleRegister}
          >
            {t('立即注册')}
          </Button>
        )}
      </div>
    </div>
  );
});
InviteRoute.displayName = 'InviteRoute';
