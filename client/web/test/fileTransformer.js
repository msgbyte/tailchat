const path = require('path');

module.exports = {
  process(src, filename, config, options) {
    const code =
      'module.exports = ' + JSON.stringify(path.basename(filename)) + ';';

    // return { code };
    return code;
  },
};
