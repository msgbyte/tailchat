import {
  parseModuleDeclaration,
  parseExports,
  ExportModuleItem,
  DeclarationModuleItem,
} from 'tailchat-plugin-declaration-generator';
import path from 'path';
import fs from 'fs-extra';

const outputPath = path.resolve(__dirname, '../tailchat.d.ts');

function exportModulesTemplate(
  items: ExportModuleItem[],
  existedModules: DeclarationModuleItem[] = []
) {
  return items
    .map((item) => {
      const findedModule = existedModules.find((m) => m.name === item.name);
      if (findedModule) {
        return `${
          findedModule.comment ? findedModule.comment + '\n  ' : ''
        }export const ${findedModule.text};`;
      } else {
        return `export const ${item.name}: any;`;
      }
    })
    .join('\n\n  ');
}

function generateDeclarationFile() {
  const { exportModules: commonExportModules } = parseExports(
    path.resolve(__dirname, '../src/plugin/common/index.ts'),
    {}
  );

  const { exportModules: commonRegExportModules } = parseExports(
    path.resolve(__dirname, '../src/plugin/common/reg.ts'),
    {}
  );

  const { exportModules: componentExportModules } = parseExports(
    path.resolve(__dirname, '../src/plugin/component/index.tsx'),
    {}
  );

  const { modules: existedModules } = parseModuleDeclaration(outputPath, {});

  const output = `/* eslint-disable @typescript-eslint/no-explicit-any */

/// <reference types="react" />

/**
 * 该文件由 Tailchat 自动生成
 * 用于插件的类型声明
 * 生成命令: pnpm run plugins:declaration:generate
 */

/**
 * Tailchat 通用
 */
declare module '@capital/common' {
  ${exportModulesTemplate(
    commonExportModules,
    existedModules['@capital/common']
  )}

  ${exportModulesTemplate(
    commonRegExportModules,
    existedModules['@capital/common']
  )}
}

/**
 * Tailchat 组件
 */
declare module '@capital/component' {
  ${exportModulesTemplate(
    componentExportModules,
    existedModules['@capital/component']
  )}
}
`;

  fs.writeFile(outputPath, output, {
    encoding: 'utf8',
  });
}

generateDeclarationFile();
