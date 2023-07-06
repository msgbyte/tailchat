import { Icon } from '@capital/component';
import icons from './icons.json';

const PLUGIN_ID = 'com.msgbyte.offline-icons';
const PLUGIN_NAME = 'Offline Icons';

console.log(`Plugin ${PLUGIN_NAME}(${PLUGIN_ID}) is loaded`);

// Icon.addIcon

icons.forEach((collection) => {
  if (!Icon.addCollection) {
    console.warn(
      'Cannot call addCollection because of Icon.addCollection has not exposed!'
    );
    return;
  }

  Icon.addCollection(collection);
});
