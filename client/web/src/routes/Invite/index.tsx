import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { InviteInfo } from './InviteInfo';
import { PortalHost } from '@/components/Portal';
import { useRecordMeasure } from '@/utils/measure-helper';
import { parseUrlStr } from 'tailchat-shared';

/**
 * 邀请界面路由
 */
const InviteRoute: React.FC = React.memo(() => {
  const { inviteCode = '' } = useParams<{ inviteCode: string }>();
  const [groupBackground, setGroupBackground] = useState('');

  useRecordMeasure('appInviteRenderStart');

  const style: React.CSSProperties = useMemo(
    () =>
      groupBackground
        ? {
            backgroundImage: `url(${parseUrlStr(groupBackground)})`,
          }
        : {
            backgroundImage: 'var(--tc-background-image)',
          },
    [groupBackground]
  );

  return (
    <PortalHost>
      <div
        className="h-full w-full bg-gray-600 flex justify-center items-center bg-center bg-cover bg-no-repeat"
        style={style}
      >
        <div className="w-96 p-4 rounded-lg shadow-lg bg-black bg-opacity-60 text-center">
          <InviteInfo
            inviteCode={inviteCode}
            onLoadInfo={(info) => {
              if (info.backgroundImage) {
                setGroupBackground(info.backgroundImage);
              }
            }}
          />
        </div>
      </div>
    </PortalHost>
  );
});
InviteRoute.displayName = 'InviteRoute';
export default InviteRoute;
