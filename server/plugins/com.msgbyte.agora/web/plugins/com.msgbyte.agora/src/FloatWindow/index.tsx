import { showToasts } from '@capital/common';
import { PortalAdd, PortalRemove, Loadable } from '@capital/component';
import React from 'react';
import { Translate } from '../translate';

const FloatMeetingWindow = Loadable(
  () => import('./window').then((module) => module.FloatMeetingWindow),
  {
    showLoading: true,
  }
);

let currentMeeting: string | null = null;

/**
 * 启动快速会议
 *
 * 表现形式是在浏览器内有个小的浮动窗口
 */
export function startFastMeeting(meetingId: string) {
  if (currentMeeting) {
    showToasts(Translate.repeatTip);
    return;
  }

  currentMeeting = meetingId;

  const key = PortalAdd(
    <FloatMeetingWindow
      meetingId={meetingId}
      onClose={() => {
        PortalRemove(key);
        currentMeeting = null;
      }}
    />
  );
}
