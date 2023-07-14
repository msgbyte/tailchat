import { Divider, Tooltip } from 'antd';
import React from 'react';
import {
  datetimeFromNow,
  formatFullTime,
  GroupInvite,
  t,
  Trans,
} from 'tailchat-shared';

interface InviteCodeExpiredAtProps {
  invite: Pick<GroupInvite, 'expiredAt' | 'usageLimit'>;
}
export const InviteCodeExpiredAt: React.FC<InviteCodeExpiredAtProps> =
  React.memo((props) => {
    const { invite } = props;

    if (invite.expiredAt && new Date(invite.expiredAt).valueOf() < Date.now()) {
      return <span>{t('该邀请码已过期')}</span>;
    }

    return (
      <>
        {!invite.expiredAt ? (
          <span>{t('该邀请码永不过期')}</span>
        ) : (
          <Trans>
            该邀请将于{' '}
            <Tooltip title={formatFullTime(invite.expiredAt)}>
              <span className="font-bold">
                {{ date: datetimeFromNow(invite.expiredAt) } as any}
              </span>
            </Tooltip>{' '}
            过期
          </Trans>
        )}

        {invite.usageLimit && (
          <>
            <Divider type="vertical" />

            <Trans>
              可使用{' '}
              <span className="font-bold">
                {{ num: invite.usageLimit } as any}
              </span>{' '}
              次
            </Trans>
          </>
        )}
      </>
    );
  });
InviteCodeExpiredAt.displayName = 'InviteCodeExpiredAt';
