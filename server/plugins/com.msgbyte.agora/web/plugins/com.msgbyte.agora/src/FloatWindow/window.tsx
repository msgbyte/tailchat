import React, { useState } from 'react';
import styled from 'styled-components';
import { ErrorBoundary } from '@capital/component';
import { MeetingView, MeetingViewProps } from './MeetingView';

const FloatWindow = styled.div`
  z-index: 100;
  position: fixed;
  background-color: var(--tc-content-background-color);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  left: 0;
  right: 0;
  top: 0;
  min-height: 240px;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;

  .folder-btn {
    background-color: var(--tc-content-background-color);
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
    position: absolute;
    bottom: -30px;
    height: 30px;
    line-height: 30px;
    left: 50%;
    width: 60px;
    margin-left: -30px;
    text-align: center;
    cursor: pointer;
    border-radius: 0 0 3px 3px;
  }
`;

/**
 * 音视频会议弹窗
 */
export const FloatMeetingWindow: React.FC<MeetingViewProps> = React.memo(
  (props) => {
    const [folder, setFolder] = useState(false);

    return (
      <FloatWindow
        style={{
          transform: folder ? 'translateY(-100%)' : 'none',
        }}
      >
        <ErrorBoundary>
          <MeetingView {...props} />
        </ErrorBoundary>

        <div className="folder-btn" onClick={() => setFolder(!folder)}>
          {folder ? '展开' : '收起'}
        </div>
      </FloatWindow>
    );
  }
);
FloatMeetingWindow.displayName = 'FloatMeetingWindow';
