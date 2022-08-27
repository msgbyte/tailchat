import ts from 'typescript';
import fs from 'fs-extra';
import ora from 'ora';

async function buildTailchatServer() {
  const spinner = ora({
    prefixText: 'Tailchat Server',
  });

  try {
    spinner.start('开始编译');
    await fs.remove('./dist');
    spinner.info('正在编译TS代码');
    await compileTsCode();
    spinner.info('正在移动静态资源文件');
    await Promise.all([
      fs.copy('./public', './dist/public', { recursive: true }),
      fs.copy('./locales', './dist/locales', { recursive: true }),
      fs.copy('./views', './dist/views', { recursive: true }),
      fs.copy(
        './services/openapi/oidc/views',
        './dist/services/openapi/oidc/views',
        { recursive: true }
      ),
    ]);

    spinner.succeed('编译完成');
  } catch (e) {
    console.error(e);
    spinner.fail('编译失败');
  }
}

buildTailchatServer();

/**
 * 编译Ts代码
 *
 * tsc的api实现
 */
function compileTsCode(): Promise<void> {
  function compile(
    fileNames: string[],
    options: ts.CompilerOptions
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const program = ts.createProgram(fileNames, options);
      const emitResult = program.emit();

      const allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);

      allDiagnostics.forEach((diagnostic) => {
        if (diagnostic.file) {
          const { line, character } = ts.getLineAndCharacterOfPosition(
            diagnostic.file,
            diagnostic.start!
          );
          const message = ts.flattenDiagnosticMessageText(
            diagnostic.messageText,
            '\n'
          );
          console.log(
            `${diagnostic.file.fileName} (${line + 1},${
              character + 1
            }): ${message}`
          );
        } else {
          console.log(
            ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
          );
        }
      });

      const exitCode = emitResult.emitSkipped ? 1 : 0;
      if (exitCode === 0) {
        resolve();
      } else {
        reject();
      }
    });
  }

  const configPath = ts.findConfigFile(
    process.cwd() /*searchPath*/,
    ts.sys.fileExists,
    'tsconfig.json'
  );
  const configFile = ts.readJsonConfigFile(configPath, ts.sys.readFile);
  const { fileNames, options } = ts.parseJsonSourceFileConfigFileContent(
    configFile,
    ts.sys,
    process.cwd()
  );

  return compile(fileNames, options);
}
