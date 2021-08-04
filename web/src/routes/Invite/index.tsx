import { Divider } from 'antd';
import React from 'react';
import { useParams } from 'react-router';
import { InviteInfo } from './InviteInfo';
import bgImage from '@assets/images/bg.jpg';
import { JoinBtn } from './JoinBtn';
import { PortalHost } from '@/components/Portal';

/**
 * 邀请界面路由
 */
export const InviteRoute: React.FC = React.memo(() => {
  const { inviteCode } = useParams<{ inviteCode: string }>();

  return (
    <PortalHost>
      <div
        className="h-full w-full bg-gray-600 flex justify-center items-center bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="w-96 p-4 rounded-lg shadow-lg bg-black bg-opacity-60 text-center">
          <InviteInfo inviteCode={inviteCode} />

          <Divider />

          <JoinBtn inviteCode={inviteCode} />
        </div>
      </div>
    </PortalHost>
  );
});
InviteRoute.displayName = 'InviteRoute';
