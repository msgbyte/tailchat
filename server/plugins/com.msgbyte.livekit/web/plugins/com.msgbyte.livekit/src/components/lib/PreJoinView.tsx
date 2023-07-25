import { useEvent, useCurrentUserInfo } from '@capital/common';
import { Avatar, Button } from '@capital/component';
import { MediaDeviceMenu, TrackToggle } from '@livekit/components-react';
import type {
  CreateLocalTracksOptions,
  LocalAudioTrack,
  LocalTrack,
  LocalVideoTrack,
} from 'livekit-client';
import {
  createLocalTracks,
  facingModeFromLocalTrack,
  Track,
} from 'livekit-client';
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { log } from '@livekit/components-core';
import { Translate } from '../../translate';
import { ParticipantAvatars } from '../ParticipantAvatars';

/**
 * Fork <PreJoin /> from "@livekit/components-react"
 */

/** @public */
export type LocalUserChoices = {
  username: string;
  videoEnabled: boolean;
  audioEnabled: boolean;
  videoDeviceId: string;
  audioDeviceId: string;
};

const DEFAULT_USER_CHOICES = {
  username: '',
  videoEnabled: true,
  audioEnabled: true,
  videoDeviceId: 'default',
  audioDeviceId: 'default',
};

/** @public */
export type PreJoinProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onSubmit'
> & {
  roomName: string;
  /** This function is called with the `LocalUserChoices` if validation is passed. */
  onSubmit?: (values: LocalUserChoices) => void;
  /**
   * Provide your custom validation function. Only if validation is successful the user choices are past to the onSubmit callback.
   */
  onValidate?: (values: LocalUserChoices) => boolean;
  onError?: (error: Error) => void;
  /** Prefill the input form with initial values. */
  defaults?: Partial<LocalUserChoices>;
  /** Display a debug window for your convenience. */
  debug?: boolean;
  joinLabel?: string;
  micLabel?: string;
  camLabel?: string;
  userLabel?: string;
};

/**
 * The PreJoin prefab component is normally presented to the user before he enters a room.
 * This component allows the user to check and select the preferred media device (camera und microphone).
 * On submit the user decisions are returned, which can then be passed on to the LiveKitRoom so that the user enters the room with the correct media devices.
 *
 * @remarks
 * This component is independent from the LiveKitRoom component and don't has to be nested inside it.
 * Because it only access the local media tracks this component is self contained and works without connection to the LiveKit server.
 *
 * @example
 * ```tsx
 * <PreJoin />
 * ```
 * @public
 */
export const PreJoinView: React.FC<PreJoinProps> = React.memo(
  ({
    roomName,
    defaults = {},
    onValidate,
    onSubmit,
    onError,
    debug,
    joinLabel = Translate.joinLabel,
    micLabel = Translate.micLabel,
    camLabel = Translate.camLabel,
    ...htmlProps
  }) => {
    const { nickname, avatar } = useCurrentUserInfo();
    const [userChoices, setUserChoices] = useState(DEFAULT_USER_CHOICES);
    const [videoEnabled, setVideoEnabled] = useState<boolean>(
      defaults.videoEnabled ?? DEFAULT_USER_CHOICES.videoEnabled
    );
    const initialVideoDeviceId =
      defaults.videoDeviceId ?? DEFAULT_USER_CHOICES.videoDeviceId;
    const [videoDeviceId, setVideoDeviceId] =
      useState<string>(initialVideoDeviceId);
    const initialAudioDeviceId =
      defaults.audioDeviceId ?? DEFAULT_USER_CHOICES.audioDeviceId;
    const [audioEnabled, setAudioEnabled] = useState<boolean>(
      defaults.audioEnabled ?? DEFAULT_USER_CHOICES.audioEnabled
    );
    const [audioDeviceId, setAudioDeviceId] =
      useState<string>(initialAudioDeviceId);

    const tracks = usePreviewTracks(
      {
        audio: audioEnabled ? { deviceId: initialAudioDeviceId } : false,
        video: videoEnabled ? { deviceId: initialVideoDeviceId } : false,
      },
      onError
    );

    const videoEl = useRef(null);

    const videoTrack = useMemo(
      () =>
        tracks?.filter(
          (track) => track.kind === Track.Kind.Video
        )[0] as LocalVideoTrack,
      [tracks]
    );

    const facingMode = useMemo(() => {
      if (videoTrack) {
        const { facingMode } = facingModeFromLocalTrack(videoTrack);
        return facingMode;
      } else {
        return 'undefined';
      }
    }, [videoTrack]);

    const audioTrack = useMemo(
      () =>
        tracks?.filter(
          (track) => track.kind === Track.Kind.Audio
        )[0] as LocalAudioTrack,
      [tracks]
    );

    useEffect(() => {
      if (videoEl.current && videoTrack) {
        videoTrack.unmute();
        videoTrack.attach(videoEl.current);
      }

      return () => {
        videoTrack?.detach();
      };
    }, [videoTrack]);

    const [isValid, setIsValid] = useState<boolean>();

    const handleValidation = useEvent((values: LocalUserChoices) => {
      if (typeof onValidate === 'function') {
        return onValidate(values);
      } else {
        return values.username !== '';
      }
    });

    useEffect(() => {
      const newUserChoices = {
        username: nickname,
        videoEnabled: videoEnabled,
        videoDeviceId: videoDeviceId,
        audioEnabled: audioEnabled,
        audioDeviceId: audioDeviceId,
      };
      setUserChoices(newUserChoices);
      setIsValid(handleValidation(newUserChoices));
    }, [
      videoEnabled,
      handleValidation,
      audioEnabled,
      audioDeviceId,
      videoDeviceId,
    ]);

    function handleSubmit(event: React.FormEvent) {
      event.preventDefault();
      if (handleValidation(userChoices)) {
        if (typeof onSubmit === 'function') {
          onSubmit(userChoices);
        }
      } else {
        log.warn('Validation failed with: ', userChoices);
      }
    }

    return (
      <div className="lk-prejoin" {...htmlProps}>
        <ParticipantAvatars roomName={roomName} />

        <div className="lk-video-container" style={{ borderRadius: 10 }}>
          {videoTrack && (
            <video
              ref={videoEl}
              width="1280"
              height="720"
              data-lk-facing-mode={facingMode}
            />
          )}
          {(!videoTrack || !videoEnabled) && (
            <div className="lk-camera-off-note">
              <Avatar size={128} src={avatar} name={nickname} />
            </div>
          )}
        </div>
        <div className="lk-button-group-container">
          <div className="lk-button-group audio">
            <TrackToggle
              initialState={audioEnabled}
              source={Track.Source.Microphone}
              onChange={(enabled) => setAudioEnabled(enabled)}
            >
              {micLabel}
            </TrackToggle>
            <div className="lk-button-group-menu">
              <MediaDeviceMenu
                initialSelection={audioDeviceId}
                kind="audioinput"
                disabled={!audioTrack}
                tracks={{ audioinput: audioTrack }}
                onActiveDeviceChange={(_, id) => setAudioDeviceId(id)}
              />
            </div>
          </div>
          <div className="lk-button-group video">
            <TrackToggle
              initialState={videoEnabled}
              source={Track.Source.Camera}
              onChange={(enabled) => setVideoEnabled(enabled)}
            >
              {camLabel}
            </TrackToggle>
            <div className="lk-button-group-menu">
              <MediaDeviceMenu
                initialSelection={videoDeviceId}
                kind="videoinput"
                disabled={!videoTrack}
                tracks={{ videoinput: videoTrack }}
                onActiveDeviceChange={(_, id) => setVideoDeviceId(id)}
              />
            </div>
          </div>
        </div>

        <Button
          size="large"
          type="primary"
          onClick={handleSubmit}
          disabled={!isValid}
        >
          {joinLabel}
        </Button>

        {debug && (
          <>
            <strong>User Choices:</strong>
            <ul
              className="lk-list"
              style={{ overflow: 'hidden', maxWidth: '15rem' }}
            >
              <li>Video Enabled: {`${userChoices.videoEnabled}`}</li>
              <li>Audio Enabled: {`${userChoices.audioEnabled}`}</li>
              <li>Video Device: {`${userChoices.videoDeviceId}`}</li>
              <li>Audio Device: {`${userChoices.audioDeviceId}`}</li>
            </ul>
          </>
        )}
      </div>
    );
  }
);
PreJoinView.displayName = 'PreJoinView';

/** @alpha */
function usePreviewTracks(
  options: CreateLocalTracksOptions,
  onError?: (err: Error) => void
) {
  const [tracks, setTracks] = useState<LocalTrack[]>();

  useEffect(() => {
    let trackPromise: Promise<LocalTrack[]> | undefined = undefined;
    let needsCleanup = false;
    if (options.audio || options.video) {
      trackPromise = createLocalTracks(options);
      trackPromise
        .then((tracks) => {
          if (needsCleanup) {
            tracks.forEach((tr) => tr.stop());
          } else {
            setTracks(tracks);
          }
        })
        .catch(onError);
    }

    return () => {
      needsCleanup = true;
      trackPromise?.then((tracks) =>
        tracks.forEach((track) => {
          track.stop();
        })
      );
    };
  }, [JSON.stringify(options)]);

  return tracks;
}
