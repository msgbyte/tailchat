import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { sharedEvent } from '@capital/common';

try {
  Sentry.init({
    dsn: 'https://177fd98a1e9e4deba84146a769633c32@o4504196236836864.ingest.sentry.io/4504196241293312',
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    integrations: [new BrowserTracing(), new Sentry.Replay()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.1, // reduce sentry quota usage
  });

  sharedEvent.on('loginSuccess', (userInfo) => {
    Sentry.setUser({
      id: userInfo._id,
      email: userInfo.email,
      username: `${userInfo.nickname}#${userInfo.discriminator}`,
      avatar: userInfo.avatar,
      temporary: userInfo.temporary,
    });
  });
} catch (err) {
  console.error(err);
}
