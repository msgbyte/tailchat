import { getUserJWT } from '@/utils/jwt-helper';
import { Button } from 'antd';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import { checkTokenValid, t, useAsync } from 'tailchat-shared';

interface Props {
  onJoinGroup: () => void;
}
export const JoinBtn: React.FC<Props> = React.memo((props) => {
  const history = useHistory();
  const { loading, value: isTokenValid } = useAsync(async () => {
    const token = await getUserJWT();
    const isTokenValid = await checkTokenValid(token);
    return isTokenValid;
  });

  const handleRegister = useCallback(() => {
    history.push(
      `/entry/register?redirect=${encodeURIComponent(location.pathname)}`
    );
  }, []);

  if (loading) {
    return null;
  }

  return isTokenValid ? (
    <Button
      block={true}
      type="primary"
      size="large"
      onClick={props.onJoinGroup}
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
