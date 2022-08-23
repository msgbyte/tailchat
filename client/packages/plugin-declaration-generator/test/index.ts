import { parseExports, parseModuleDeclaration } from '../src/tsgenerator';
import path from 'path';

const { exportModules } = parseExports(
  path.resolve(__dirname, './demo/index.ts'),
  {
    paths: { '@/*': ['./*'] },
  }
);

console.log('exportModules', exportModules);

const { modules } = parseModuleDeclaration(
  path.resolve(__dirname, './index.d.ts'),
  {
    paths: { '@/*': ['./*'] },
  }
);

console.log('modules', modules);
