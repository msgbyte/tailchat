import {
  ClientConfig,
  createClient,
  createMicrophoneAndCameraTracks,
} from 'agora-rtc-react';

const config: ClientConfig = {
  mode: 'rtc',
  codec: 'vp8',
};

export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
