import { Tooltip } from 'antd';
import React from 'react';
import {
  datetimeFromNow,
  formatFullTime,
  GroupInvite,
  t,
  Trans,
} from 'tailchat-shared';

interface InviteCodeExpiredAtProps {
  invite: Pick<GroupInvite, 'expiredAt'>;
}
export const InviteCodeExpiredAt: React.FC<InviteCodeExpiredAtProps> =
  React.memo((props) => {
    const { invite } = props;

    if (!invite.expiredAt) {
      return t('该邀请码永不过期');
    }

    return (
      <Trans>
        该邀请将于{' '}
        <Tooltip title={formatFullTime(invite.expiredAt)}>
          <span className="font-bold">
            {{ date: datetimeFromNow(invite.expiredAt) }}
          </span>
        </Tooltip>{' '}
        过期
      </Trans>
    );
  });
InviteCodeExpiredAt.displayName = 'InviteCodeExpiredAt';
