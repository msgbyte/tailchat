import dtsgen from 'dts-generator';
import path from 'path';

/**
 * :WIP:
 * TODO: tailchat.d.ts的路径尚未完善
 * 等完善后再追踪改文件的变更
 */

declare module 'dts-generator' {
  interface DtsGeneratorOptions {
    prefix?: string;
  }
}

dtsgen({
  main: '__tailchat__/common/index',
  name: '@capital/commmon',
  out: 'tailchat.d.ts',
  prefix: '__tailchat__',
  baseDir: path.resolve(__dirname, '../src'),
  rootDir: path.resolve(__dirname, '../src'),
  files: [path.resolve(__dirname, '../src/plugin/common/index.ts')],
});
