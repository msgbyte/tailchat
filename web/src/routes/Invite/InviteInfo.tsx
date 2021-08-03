import { Avatar } from '@/components/Avatar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { UserName } from '@/components/UserName';
import React from 'react';
import {
  datetimeFromNow,
  getCachedGroupInviteInfo,
  getGroupBasicInfo,
  showErrorToasts,
  t,
  useAsync,
} from 'tailchat-shared';

interface Props {
  inviteCode: string;
}
export const InviteInfo: React.FC<Props> = React.memo((props) => {
  const { inviteCode } = props;

  const { loading, value } = useAsync(async () => {
    try {
      const invite = await getCachedGroupInviteInfo(inviteCode);
      if (invite === null) {
        throw new Error(t('找不到邀请信息'));
      }
      const groupBasicInfo = await getGroupBasicInfo(invite.groupId);
      if (groupBasicInfo === null) {
        throw new Error(t('找不到群组信息'));
      }

      return {
        group: groupBasicInfo,
        creator: invite.creator,
        expired: invite.expiredAt,
      };
    } catch (err) {
      showErrorToasts(err);
    }
  }, [inviteCode]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!value) {
    return <div>{t('群组信息加载失败')}</div>;
  }

  return (
    <div>
      <div>
        <Avatar
          className="mb-4"
          size={64}
          src={value.group.avatar}
          name={value.group.name}
        />
      </div>
      <div>
        <UserName className="font-bold" userId={value.creator} />{' '}
        {t('邀请您加入群组')}
      </div>
      <div className="text-xl my-2 font-bold">{value.group.name}</div>
      <div>
        {t('当前成员数')}: {value.group.memberCount}
      </div>

      {value.expired && (
        <div>
          该邀请将于{' '}
          <span className="font-bold">{datetimeFromNow(value.expired)}</span>{' '}
          过期
        </div>
      )}
    </div>
  );
});
InviteInfo.displayName = 'InviteInfo';
