import { build } from 'webpack-test-utils';
import * as fixtures from './fixtures';
import { configureLoader } from './utils';

async function test() {
  const built = await build(fixtures.tsx, (config) => {
    configureLoader(config);
  });

  console.log(built.stats.endTime - built.stats.startTime);

  console.log(built.stats.compilation.errors.length);
  console.log(built.stats.compilation.errors);
}

test();
