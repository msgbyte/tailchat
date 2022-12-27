import { showToasts } from '@capital/common';
import { PortalAdd, PortalRemove } from '@capital/component';
import React from 'react';
import { FloatMeetingWindow } from './window';

let currentMeeting: string | null = null;

/**
 * TODO
 *
 * 启动快速会议
 *
 * 表现形式是在浏览器内有个小的浮动窗口
 */
export function startFastMeeting(meetingId: string) {
  if (currentMeeting) {
    showToasts('当前已有正在进行中的通话, 请先结束上一场通话');
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
