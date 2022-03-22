import { parseFile } from '../src/tsgenerator';
import path from 'path';

const { exportModules } = parseFile(
  path.resolve(__dirname, './demo/index.ts'),
  {
    paths: { '@/*': ['./*'] },
  }
);

console.log(exportModules);
