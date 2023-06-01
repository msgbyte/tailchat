import { Avatar } from 'tailchat-design';
import { InviteCodeExpiredAt } from '@/components/InviteCodeExpiredAt';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { UserNamePure } from '@/components/UserName';
import { Divider } from 'antd';
import React from 'react';
import {
  getCachedGroupInviteInfo,
  getGroupBasicInfo,
  showErrorToasts,
  t,
  useAsync,
} from 'tailchat-shared';
import { JoinBtn } from './JoinBtn';

interface Props {
  inviteCode: string;
}
export const InviteInfo: React.FC<Props> = React.memo((props) => {
  const { inviteCode } = props;

  const { loading, value: inviteInfo } = useAsync(async () => {
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

  if (!inviteInfo) {
    return <div>{t('群组信息加载失败')}</div>;
  }

  return (
    <>
      <div className="text-white">
        <div>
          <Avatar
            className="mx-auto mb-4"
            size={64}
            src={inviteInfo.group.avatar}
            name={inviteInfo.group.name}
          />
        </div>
        <div>
          <UserNamePure className="font-bold" userId={inviteInfo.creator} />{' '}
          {t('邀请您加入群组')}
        </div>
        <div className="text-xl my-2 font-bold">{inviteInfo.group.name}</div>
        <div>
          {t('当前成员数')}: {inviteInfo.group.memberCount}
        </div>

        {/* 永久邀请码不显示过期时间 */}
        {inviteInfo.expired && (
          <div>
            <InviteCodeExpiredAt invite={{ expiredAt: inviteInfo.expired }} />
          </div>
        )}
      </div>

      <Divider />

      <JoinBtn inviteCode={inviteCode} expired={inviteInfo.expired} />
    </>
  );
});
InviteInfo.displayName = 'InviteInfo';
