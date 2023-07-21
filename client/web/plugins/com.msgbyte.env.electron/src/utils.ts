import { sharedEvent, postMessageEvent } from '@capital/common';

/**
 * 转发事件
 */
export function forwardSharedEvent(
  eventName: string,
  processPayload?: (payload: any) => Promise<{ type: string; payload: any }>
) {
  sharedEvent.on(eventName as any, async (payload: any) => {
    let type = eventName;
    if (processPayload) {
      const res = await processPayload(payload);
      if (!res) {
        // Skip if res is undefined
        return;
      }

      payload = res.payload;
      type = res.type;
    }

    postMessageEvent(type, payload);
  });
}

interface ElectronDeviceInfo {
  name: string;
  version: string;
  platform: string;
}
export function getDeviceInfo() {
  const deviceInfo: ElectronDeviceInfo = {
    name: '',
    version: '0.0.0',
    platform: 'windows',
    ...((window as any).__electronDeviceInfo ?? {}),
  };

  return deviceInfo;
}
