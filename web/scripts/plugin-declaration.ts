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
  name: '', // 这个是为了跳过类型问题，其实移除该项也是可以的
  out: 'tailchat.d.ts',
  prefix: '@capital',
  baseDir: path.resolve(__dirname, '../src/plugin'),
  files: [path.resolve(__dirname, '../src/plugin/common/index.ts')],
});
