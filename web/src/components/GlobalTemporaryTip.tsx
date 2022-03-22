import { openModal } from '@/plugin/common';
import { Button } from 'antd';
import React, { useCallback } from 'react';
import { t, Trans, useUserInfo } from 'tailchat-shared';
import { closeModal } from './Modal';
import { ClaimTemporaryUser } from './modals/ClaimTemporaryUser';

/**
 * 访客账号提示
 */
export const GlobalTemporaryTip: React.FC = React.memo(() => {
  const userInfo = useUserInfo();
  const show = userInfo?.temporary === true;

  const handleClaim = useCallback(() => {
    if (!userInfo?._id) {
      return;
    }

    const key = openModal(
      <ClaimTemporaryUser
        userId={userInfo._id}
        onSuccess={() => closeModal(key)}
      />
    );
  }, [userInfo?._id]);

  return show ? (
    <div className="text-center bg-indigo-400 text-white">
      <Trans>
        当前使用的是一个临时账号,{' '}
        <Button
          type="link"
          className="text-indigo-700 font-bold"
          size="small"
          onClick={handleClaim}
        >
          立即认领
        </Button>
      </Trans>
    </div>
  ) : null;
});
GlobalTemporaryTip.displayName = 'GlobalTemporaryTip';
