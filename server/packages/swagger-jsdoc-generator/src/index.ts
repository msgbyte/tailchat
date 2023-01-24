import { Project } from 'ts-morph';
import path from 'path';
import globby from 'globby';
import { processService } from './processService';

/**
 * https://ts-morph.com/setup/
 */

/**
 * 扫描服务
 */
async function scanServices() {
  const serviceFiles = await globby('./services/**/*.service.ts');

  console.time('parse project usage');
  const project = new Project({
    tsConfigFilePath: path.resolve(process.cwd(), './tsconfig.json'),
  });
  console.timeEnd('parse project usage');

  console.time('parse source usage');

  // 单个测试
  const sourceFile = project.getSourceFileOrThrow(serviceFiles[0]);
  processService(sourceFile);

  console.timeEnd('parse source usage');
}

scanServices();
