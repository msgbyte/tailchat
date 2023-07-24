import { Track } from 'livekit-client';
import * as React from 'react';

import { supportsScreenSharing } from '@livekit/components-core';
import {
  ChatToggle,
  DisconnectButton,
  MediaDeviceMenu,
  StartAudio,
  TrackToggle,
  useLocalParticipantPermissions,
  useMaybeLayoutContext,
} from '@livekit/components-react';
import { Translate } from '../../translate';
import { useMediaQuery } from '../../utils/useMediaQuery';
import { ChatIcon } from './icons/ChatIcon';
import { LeaveIcon } from './icons/LeaveIcon';

/** @public */
export type ControlBarControls = {
  microphone?: boolean;
  camera?: boolean;
  chat?: boolean;
  screenShare?: boolean;
  leave?: boolean;
};

/** @public */
export type ControlBarProps = React.HTMLAttributes<HTMLDivElement> & {
  variation?: 'minimal' | 'verbose' | 'textOnly';
  controls?: ControlBarControls;
};

/**
 * The ControlBar prefab component gives the user the basic user interface
 * to control their media devices and leave the room.
 *
 * @remarks
 * This component is build with other LiveKit components like `TrackToggle`,
 * `DeviceSelectorButton`, `DisconnectButton` and `StartAudio`.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <ControlBar />
 * </LiveKitRoom>
 * ```
 * @public
 */
export function ControlBar({ variation, controls, ...props }: ControlBarProps) {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const layoutContext = useMaybeLayoutContext();
  React.useEffect(() => {
    if (layoutContext?.widget.state?.showChat !== undefined) {
      setIsChatOpen(layoutContext?.widget.state?.showChat);
    }
  }, [layoutContext?.widget.state?.showChat]);
  const isTooLittleSpace = useMediaQuery(
    `(max-width: ${isChatOpen ? 1000 : 760}px)`
  );

  const defaultVariation = isTooLittleSpace ? 'minimal' : 'verbose';
  variation ??= defaultVariation;

  const visibleControls = { leave: true, ...controls };

  const localPermissions = useLocalParticipantPermissions();

  if (!localPermissions) {
    visibleControls.camera = false;
    visibleControls.chat = false;
    visibleControls.microphone = false;
    visibleControls.screenShare = false;
  } else {
    visibleControls.camera ??= localPermissions.canPublish;
    visibleControls.microphone ??= localPermissions.canPublish;
    visibleControls.screenShare ??= localPermissions.canPublish;
    visibleControls.chat ??= localPermissions.canPublishData && controls?.chat;
  }

  const showIcon = React.useMemo(
    () => variation === 'minimal' || variation === 'verbose',
    [variation]
  );
  const showText = React.useMemo(
    () => variation === 'textOnly' || variation === 'verbose',
    [variation]
  );

  const browserSupportsScreenSharing = supportsScreenSharing();

  const [isScreenShareEnabled, setIsScreenShareEnabled] = React.useState(false);

  const onScreenShareChange = (enabled: boolean) => {
    setIsScreenShareEnabled(enabled);
  };

  return (
    <div className="lk-control-bar" {...props}>
      {visibleControls.microphone && (
        <div className="lk-button-group">
          <TrackToggle source={Track.Source.Microphone} showIcon={showIcon}>
            {showText && Translate.micLabel}
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu kind="audioinput" />
          </div>
        </div>
      )}

      {visibleControls.camera && (
        <div className="lk-button-group">
          <TrackToggle source={Track.Source.Camera} showIcon={showIcon}>
            {showText && Translate.camLabel}
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu kind="videoinput" />
          </div>
        </div>
      )}

      {visibleControls.screenShare && browserSupportsScreenSharing && (
        <TrackToggle
          source={Track.Source.ScreenShare}
          captureOptions={{ audio: true, selfBrowserSurface: 'include' }}
          showIcon={showIcon}
          onChange={onScreenShareChange}
        >
          {showText &&
            (isScreenShareEnabled
              ? Translate.stopScreenShare
              : Translate.startScreenShare)}
        </TrackToggle>
      )}

      {visibleControls.chat && (
        <ChatToggle>
          {showIcon && <ChatIcon />}
          {showText && Translate.chat}
        </ChatToggle>
      )}

      {visibleControls.leave && (
        <DisconnectButton>
          {showIcon && <LeaveIcon />}
          {showText && Translate.leave}
        </DisconnectButton>
      )}

      <StartAudio label={Translate.startAudio} />
    </div>
  );
}
