import { sharedEvent } from '@capital/common';

/**
 * 转发事件
 */
export function forwardSharedEvent(
  eventName: string,
  processPayload?: (payload: any) => Promise<{ type: string; payload: any }>
) {
  if (!(window as any).ReactNativeWebView) {
    return;
  }

  sharedEvent.on(eventName, async (payload: any) => {
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

    (window as any).ReactNativeWebView.postMessage(
      JSON.stringify({
        _isTailchat: true,
        type,
        payload,
      })
    );
  });
}
