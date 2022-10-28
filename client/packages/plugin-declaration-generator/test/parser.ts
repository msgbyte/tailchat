import { parseDeclarationEntry } from '../src/parser';
import path from 'path';

const project = parseDeclarationEntry({
  entryPath: path.resolve(__dirname, './demo/index.ts'),
  project: {
    tsConfigFilePath: path.resolve(__dirname, './demo/tsconfig.json'),
  },
});

console.log(
  'sourceFile',
  project.getSourceFiles().map((item) => item.getFilePath())
);
