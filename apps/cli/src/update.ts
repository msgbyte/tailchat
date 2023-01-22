import updateNotifier from 'update-notifier';
const packageJson = require('../package.json');

updateNotifier({
  pkg: packageJson,
  shouldNotifyInNpmScript: true,
}).notify();
