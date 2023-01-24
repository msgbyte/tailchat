import AgoraRTC, { ClientConfig, createClient } from 'agora-rtc-react';

const config: ClientConfig = {
  mode: 'rtc',
  codec: 'vp8',
};

export const useClient = createClient(config);
export const createCameraVideoTrack = AgoraRTC.createCameraVideoTrack;
export const createMicrophoneAudioTrack = AgoraRTC.createMicrophoneAudioTrack;

// 屏幕共享
export const useScreenSharingClient = createClient(config);
export const createScreenVideoTrack = AgoraRTC.createScreenVideoTrack;
