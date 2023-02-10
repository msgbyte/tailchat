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

export async function initNotificationEnv() {
  await notifee.requestPermission();

  await initForegroundService();
}

async function initForegroundService() {
  notifee.registerForegroundService((_notification) => {
    return new Promise(() => {
      // 一直pending，因此前台服务会一直存在

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
    title: 'Foreground service',
    body: 'This notification will exist for the lifetime of the service runner',
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
