import notifee, { EventType } from '@notifee/react-native';
import { translate } from '../i18n';
import { bindAlias } from './getui';

interface NotificationInfo {
  title: string;
  body: string;
  icon?: string;
}

// Create a channel (required for Android)
async function createDefaultChannel() {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  return channelId;
}

/**
 * 显示本地通知
 */
export async function showNotification(info: NotificationInfo) {
  console.log('call showNotification', info);

  await notifee.requestPermission(); // Request permissions (required for iOS)

  const channelId = await createDefaultChannel();

  // Display a notification
  await notifee.displayNotification({
    title: info.title,
    body: info.body,
    android: {
      channelId,
      // largeIcon: info.icon ?? undefined,
      // smallIcon: info.icon ?? undefined,
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}

interface NotificationOptions {
  userId: string;
  nickname: string;
  runService: () => void;
}
export async function initNotificationEnv(options: NotificationOptions) {
  await notifee.requestPermission();

  bindAlias(options.userId);

  // 厂商渠道还没有ready, 推送需要依赖前台服务保活
  // await initForegroundService(options);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function initForegroundService(options: NotificationOptions) {
  notifee.registerForegroundService((_notification) => {
    return new Promise(() => {
      // 一直pending，因此前台服务会一直存在
      options.runService();

      notifee.onForegroundEvent(async ({ type, detail }) => {
        if (
          type === EventType.ACTION_PRESS &&
          detail.pressAction?.id === 'stop'
        ) {
          await notifee.stopForegroundService();
        }
      });
    });
  });

  const channelId = await createDefaultChannel();

  notifee.displayNotification({
    title: `Tailchat: ${options.nickname}`,
    body: translate('core.foregroundServiceTip'),
    android: {
      channelId,
      asForegroundService: true,
      actions: [
        {
          title: translate('core.foregroundServiceStopAction'),
          pressAction: {
            id: 'stop',
          },
        },
      ],
    },
  });
}
