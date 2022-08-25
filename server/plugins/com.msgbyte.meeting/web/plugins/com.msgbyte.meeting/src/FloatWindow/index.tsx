import { showToasts } from '@capital/common';
import { PortalAdd, PortalRemove, ErrorBoundary } from '@capital/component';
import React from 'react';
import { FloatMeetingWindowWrapper } from './window';

const currentMeeting: string | null = null;

/**
 * TODO
 *
 * 启动快速会议
 *
 * 表现形式是在浏览器内有个小的浮动窗口
 */
export function startFastMeeting(meetingId: string) {
  console.log('startFastMeeting:', meetingId);

  if (currentMeeting) {
    showToasts('当前已有正在进行中的通话, 请先结束上一场通话');
    return;
  }

  const key = PortalAdd(
    <ErrorBoundary>
      <FloatMeetingWindowWrapper
        meetingId={meetingId}
        onClose={() => {
          PortalRemove(key);
        }}
      />
    </ErrorBoundary>
  );
}
