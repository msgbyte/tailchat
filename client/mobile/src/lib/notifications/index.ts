import notifee, { EventType } from '@notifee/react-native';

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
  nickname: string;
  runService: () => void;
}
export async function initNotificationEnv(options: NotificationOptions) {
  await notifee.requestPermission();

  await initForegroundService(options);
}

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
    body: '持续保持服务正常运行, 关闭后可能无法正常接受到消息推送',
    android: {
      channelId,
      asForegroundService: true,
      actions: [
        {
          title: '停止前台服务',
          pressAction: {
            id: 'stop',
          },
        },
      ],
    },
  });
}
