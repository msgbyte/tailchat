const path = require('path');

module.exports = {
  process(src, filename, config, options) {
    return {
      code: 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';',
    };
  },
};
