import React, { useState } from 'react';
import styled from 'styled-components';
import { Divider, ErrorBoundary } from '@capital/component';
import { MeetingView, MeetingViewProps } from './MeetingView';
import { SpeakerNames } from './SpeakerNames';

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

  .folder-btn-container {
    position: absolute;
    bottom: -30px;
    left: 0;
    right: 0;
    display: flex;

    > .folder-btn {
      background-color: var(--tc-content-background-color);
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      border-radius: 0 0 3px 3px;
      margin: auto;
      display: inline-block;
      padding: 0 8px;
    }
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

        <div className="folder-btn-container">
          <div className="folder-btn" onClick={() => setFolder(!folder)}>
            <SpeakerNames />

            <Divider type="vertical" />

            <span style={{ marginLeft: 4 }}>{folder ? '展开' : '收起'}</span>
          </div>
        </div>
      </FloatWindow>
    );
  }
);
FloatMeetingWindow.displayName = 'FloatMeetingWindow';
