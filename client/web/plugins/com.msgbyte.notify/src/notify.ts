import {
  regSocketEventListener,
  getGlobalState,
  getCachedUserInfo,
  getServiceWorkerRegistration,
} from '@capital/common';

export function initNotify() {
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }

  regSocketEventListener({
    eventName: 'chat.message.add',
    eventFn: (message) => {
      const currentUserId = getGlobalState()?.user.info._id;
      if (currentUserId !== message.author) {
        // 创建通知

        // TODO: 需要增加所在群组
        if (Notification.permission === 'granted') {
          Promise.all([getCachedUserInfo(message.author)]).then(
            ([userInfo]) => {
              const nickname = userInfo?.nickname ?? '';
              const icon = userInfo?.avatar ?? undefined;
              const content = message.content;

              const registration: ServiceWorkerRegistration | null =
                getServiceWorkerRegistration();

              if (registration) {
                registration.showNotification(`来自 ${nickname}`, {
                  body: content,
                  icon,
                  tag: 'tailchat-message',
                  renotify: true,
                });
              } else {
                // fallback
                new Notification(`来自 ${nickname}`, {
                  body: content,
                  icon,
                  tag: 'tailchat-message',
                  renotify: true,
                });
              }
            }
          );
        }
      }
    },
  });
}
