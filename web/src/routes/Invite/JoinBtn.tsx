import { openModal } from '@/components/Modal';
import { getUserJWT } from '@/utils/jwt-helper';
import { Button } from 'antd';
import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import {
  applyGroupInvite,
  checkTokenValid,
  getCachedGroupInviteInfo,
  showToasts,
  t,
  useAsync,
  useAsyncRequest,
} from 'tailchat-shared';
import { SuccessModal } from './SuccessModal';

interface Props {
  inviteCode: string;
}
export const JoinBtn: React.FC<Props> = React.memo((props) => {
  const history = useHistory();
  const { loading, value: isTokenValid } = useAsync(async () => {
    const token = await getUserJWT();
    const isTokenValid = await checkTokenValid(token);
    return isTokenValid;
  });
  const [isJoined, setIsJoined] = useState(false);

  const handleRegister = useCallback(() => {
    history.push(
      `/entry/register?redirect=${encodeURIComponent(location.pathname)}`
    );
  }, []);

  const [{ loading: joinLoading }, handleJoinGroup] =
    useAsyncRequest(async () => {
      await applyGroupInvite(props.inviteCode);

      const invite = await getCachedGroupInviteInfo(props.inviteCode);
      openModal(<SuccessModal groupId={invite?.groupId ?? ''} />, {
        maskClosable: false,
      });
      setIsJoined(true);
    }, [props.inviteCode]);

  if (loading) {
    return null;
  }

  if (isJoined) {
    return (
      <Button block={true} type="primary" size="large" disabled={true}>
        {t('已加入')}
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
    <Button block={true} type="primary" size="large" onClick={handleRegister}>
      {t('立即注册')}
    </Button>
  );
});
JoinBtn.displayName = 'JoinBtn';
