import { build } from 'webpack-test-utils';
import * as fixtures from './fixtures';
import { configureLoader } from './utils';

async function test() {
  const built = await build(fixtures.tsx, (config) => {
    configureLoader(config);

    console.log('configureLoader(config);', config.module.rules);
  });

  console.log('usage:', built.stats.endTime - built.stats.startTime, 'ms');
  console.log('errors:', built.stats.compilation.errors.length);
  // console.log(built.stats.compilation.errors);
}

test();
