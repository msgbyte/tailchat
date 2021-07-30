import { Button, Divider } from 'antd';
import React, { useCallback } from 'react';
import { useHistory, useParams } from 'react-router';

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
    <div className="h-full w-full">
      <div className="w-96 h-72">
        <div>{inviteCode}</div>
        <div>xxx 邀请您加入</div>
        <div>[群组名]</div>
        <div>成员数: </div>

        <Divider />

        {isLogin ? (
          <Button onClick={handleJoinGroup}>加入群组</Button>
        ) : (
          <Button onClick={handleRegister}>立即注册</Button>
        )}
      </div>
    </div>
  );
});
InviteRoute.displayName = 'InviteRoute';
