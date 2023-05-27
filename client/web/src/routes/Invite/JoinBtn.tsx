import { openModal } from '@/components/Modal';
import { getUserJWT } from '@/utils/jwt-helper';
import { Button } from 'antd';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  applyGroupInvite,
  checkTokenValid,
  getCachedGroupInviteInfo,
  model,
  showErrorToasts,
  t,
  useAsync,
  useAsyncRequest,
} from 'tailchat-shared';
import { SuccessModal } from './SuccessModal';

interface Props {
  inviteCode: string;
  expired?: string;
}
export const JoinBtn: React.FC<Props> = React.memo((props) => {
  const navigate = useNavigate();
  const { loading, value: isTokenValid } = useAsync(async () => {
    const token = await getUserJWT();
    if (!token) {
      return false;
    }

    const isTokenValid = await checkTokenValid(token);
    return isTokenValid;
  });
  const [isJoined, setIsJoined] = useState(false);

  const handleLogin = useCallback(() => {
    navigate(`/entry/login?redirect=${encodeURIComponent(location.pathname)}`);
  }, []);

  const { value: invite } = useAsync(() => {
    return getCachedGroupInviteInfo(props.inviteCode);
  }, [props.inviteCode]);

  useAsync(async () => {
    // 检查用户是否已经加入
    if (!isTokenValid) {
      return;
    }

    if (!invite) {
      return;
    }

    try {
      const isMember = await model.group.isMember(invite.groupId);
      if (isMember) {
        setIsJoined(true);
      }
    } catch (err) {}
  }, [isTokenValid, invite]);

  const [{ loading: joinLoading }, handleJoinGroup] =
    useAsyncRequest(async () => {
      await applyGroupInvite(props.inviteCode);

      if (!invite) {
        showErrorToasts(t('未找到邀请码信息'));
        return;
      }
      openModal(<SuccessModal groupId={invite.groupId} />, {
        maskClosable: false,
      });
      setIsJoined(true);
    }, [props.inviteCode, invite]);

  const [, handleJumpToGroup] = useAsyncRequest(async () => {
    if (!invite) {
      showErrorToasts(t('未找到邀请码信息'));
      return;
    }

    navigate(`/main/group/${invite.groupId}`);
  }, [navigate, invite]);

  if (loading) {
    return null;
  }

  if (isJoined) {
    return (
      <Button
        block={true}
        type="primary"
        size="large"
        onClick={handleJumpToGroup}
      >
        {t('已加入，跳转到群组')}
      </Button>
    );
  }

  if (props.expired && new Date(props.expired).valueOf() < Date.now()) {
    return (
      <Button block={true} type="primary" size="large" disabled={true}>
        {t('邀请码已过期')}
      </Button>
    );
  }

  return isTokenValid ? (
    <Button
      block={true}
      type="primary"
      size="large"
      loading={joinLoading}
      onClick={handleJoinGroup}
    >
      {t('加入群组')}
    </Button>
  ) : (
    <Button block={true} type="primary" size="large" onClick={handleLogin}>
      {t('尚未登录, 立即登录')}
    </Button>
  );
});
JoinBtn.displayName = 'JoinBtn';
