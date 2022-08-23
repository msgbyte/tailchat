import { generateFunctionDeclare } from 'tailchat-plugin-declaration-generator';
import path from 'path';

/**
 * 这个工具主要是用来自动扫描入口文件导出内容
 *
 * 以减少缺失的内容获取
 */

generateFunctionDeclare({
  entryPath: path.resolve(__dirname, '../src/plugin/common/index.ts'),
}).then((code) => {
  console.log('预计输出代码如下:');
  console.log('-----------------');
  console.log(code);
});
