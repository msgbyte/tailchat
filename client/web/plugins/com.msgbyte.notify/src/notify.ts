import {
  regSocketEventListener,
  getGlobalState,
  getCachedUserInfo,
  getServiceWorkerRegistration,
  navigate,
} from '@capital/common';
import { Translate } from './translate';
import { hasSilent } from './silent';

export function initNotify() {
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }

  const registration: ServiceWorkerRegistration | null =
    getServiceWorkerRegistration();

  if (registration) {
    registration.addEventListener('notificationclick', (e: any) => {
      const tag = e.notification.tag;
      const data = e.notification.data;

      handleMessageNotifyClick(tag, data);
    });
  }

  regSocketEventListener({
    eventName: 'chat.message.add',
    eventFn: (message) => {
      const converseId = message.converseId;
      const currentUserId = getGlobalState()?.user.info._id;

      if (hasSilent(converseId)) {
        // 免打扰
        return;
      }

      if (currentUserId !== message.author) {
        // 创建通知

        // TODO: 需要增加所在群组
        if (Notification.permission === 'granted') {
          Promise.all([getCachedUserInfo(message.author)]).then(
            ([userInfo]) => {
              const nickname = userInfo?.nickname ?? '';
              const icon = userInfo?.avatar ?? undefined;
              const content = message.content;

              const title = `${Translate.from} ${nickname}`;
              const options: NotificationOptions = {
                body: content,
                icon,
                tag: 'tailchat-message',
                renotify: true,
                data: message,
              };

              if (registration && registration.showNotification) {
                registration.showNotification(title, options);
              } else {
                // fallback
                const notification = new Notification(title, options);
                notification.onclick = (e: any) => {
                  const tag = e.target.tag;
                  const data = e.target.data;

                  handleMessageNotifyClick(tag, data);
                };
              }
            }
          );
        }
      }
    },
  });
}

/**
 * 点击通知栏事件
 */
function handleMessageNotifyClick(tag, data) {
  if (tag === 'tailchat-message') {
    const message = data;

    window.focus();
    const { converseId, groupId } = message ?? {};
    if (!converseId) {
      console.warn('[notify] Not found converseId');
      return;
    }
    if (groupId) {
      // 群组消息
      navigate(`/main/group/${groupId}/${converseId}`);
    } else {
      // 私信会话
      navigate(`/main/personal/converse/${converseId}`);
    }
  }

  console.log(tag, data);
}
