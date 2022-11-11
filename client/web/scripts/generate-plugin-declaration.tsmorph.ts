import { parseDeclarationEntry } from 'tailchat-plugin-declaration-generator';
import path from 'path';

// WIP
function generateDeclarationFile() {
  const { exportDefs } = parseDeclarationEntry({
    entryPath: path.resolve(__dirname, './test-export.ts'),
    project: {
      tsConfigFilePath: path.resolve(__dirname, '../tsconfig.json'),
    },
  });
  console.log(exportDefs);
}

generateDeclarationFile();
