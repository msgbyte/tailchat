const exec = require('execa');
const version = require('../package.json').version;
const path = require('path');

const tagName = `moonrailgun/tailchat-server:${version}`;

console.log(`Start build docker image: [${tagName}] ...`);

exec('docker', ['build', '.', '-t', tagName], {
  cwd: path.resolve(__dirname, '../'),
  stdout: 'inherit',
  stderr: 'inherit',
})
  .then(() => {
    console.log('Build docker image succeed!');
    console.log(`Push with command: docker push ${tagName}`);
  })
  .catch((err) => {
    console.error(err);
  });
