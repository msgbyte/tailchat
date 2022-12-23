import {
  ClientConfig,
  createClient,
  createMicrophoneAndCameraTracks,
} from 'agora-rtc-react';

const config: ClientConfig = {
  mode: 'rtc',
  codec: 'vp8',
};

// TODO 应该从本地设置或者远程中获取
export const appId = ''; //ENTER APP ID HERE
export const token = '';

export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
