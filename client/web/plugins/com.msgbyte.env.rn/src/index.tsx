import { sharedEvent } from '@capital/common';

const PLUGIN_NAME = 'ReactNative支持';

console.log(`Plugin ${PLUGIN_NAME} is loaded`);

sharedEvent.on('loadColorScheme', (colorScheme: string) => {
  window.postMessage(
    {
      _isTailchat: true,
      type: 'loadColorScheme',
      payload: colorScheme,
    },
    '*'
  );
});
