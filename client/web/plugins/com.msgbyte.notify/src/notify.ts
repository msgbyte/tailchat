import {
  regSocketEventListener,
  getGlobalState,
  getCachedUserInfo,
  getCachedConverseInfo,
  getCachedBaseGroupInfo,
  getServiceWorkerRegistration,
  navigate,
} from '@capital/common';
import { Translate } from './translate';
import { hasSilent } from './silent';
import { incBubble, setBubble } from './bubble';

const TAG = 'tailchat-message';

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

  let isBlur = false;
  window.addEventListener('focus', () => {
    setBubble(0); // 点击时清空
    isBlur = false;
  });
  window.addEventListener('blur', () => (isBlur = true));

  regSocketEventListener({
    eventName: 'chat.message.add',
    eventFn: (message) => {
      const converseId = message.converseId;
      const currentUserId = getGlobalState()?.user.info._id;

      if (hasSilent(converseId)) {
        // 手动设置了当前会话免打扰
        return;
      }

      if (currentUserId === message.author) {
        // 忽略本人消息
        return;
      }

      const hidden = window.document.hidden ?? false;
      if (hidden || isBlur) {
        // 如果当前不是活跃窗口或处于隐藏状态，则创建通知

        if (Notification.permission === 'granted') {
          // TODO: 需要增加显示所在群组
          Promise.all([
            getCachedUserInfo(message.author),
            message.groupId
              ? getCachedBaseGroupInfo(message.groupId).then((d) => d.name)
              : Promise.resolve(Translate.dm),
          ]).then(([userInfo, scopeName]) => {
            const nickname = userInfo?.nickname ?? '';
            const icon = userInfo?.avatar ?? undefined;
            const content = message.content;

            const title = `${Translate.from} [${scopeName}] ${nickname}`;
            const options: NotificationOptions = {
              body: content,
              icon,
              tag: TAG,
              renotify: true,
              data: message,
              silent: true, // 因为有提示音了，所以禁音默认音
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
          });
        }

        incBubble();
      }
      tryPlayNotificationSound(); // 不管当前是不是处于活跃状态，都发出提示音
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
}

/**
 * 尝试播放通知声音
 */
function tryPlayNotificationSound() {
  try {
    const audio = new Audio(
      '/plugins/com.msgbyte.notify/assets/sounds_bing.mp3'
    );
    audio.play();
  } catch (err) {
    console.error(err);
  }
}
