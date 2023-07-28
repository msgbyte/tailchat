import ts from 'typescript';
import fs from 'fs-extra';
import ora from 'ora';
import { glob } from 'glob';
import path from 'path';
import execa from 'execa';

async function buildTailchatServer() {
  const spinner = ora({
    prefixText: 'Tailchat Server',
  });

  try {
    spinner.start('Start compiling');
    await fs.remove('./dist');
    spinner.info('Compiling TS code');
    await compileTsCode();
    spinner.info('Moving static resource files');
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

    if (process.platform !== 'win32' || (await isAdmin())) {
      spinner.info('Building plugin dependent symlink');
      const nodeModulesList = await glob('./plugins/*/node_modules/*');
      for (const item of nodeModulesList) {
        const src = path.resolve(__dirname, '../', item);
        const dest = path.resolve(__dirname, '../dist', item);

        spinner.text = `Building Symlink: ${src} -> ${dest}`;

        await fs.createSymlink(src, dest, 'dir');
      }
    } else {
      spinner.warn(
        'You are run command in windows without admin permit, create symlink will be skip'
      );
    }

    spinner.succeed('Compiled!');
  } catch (e) {
    console.error(e);
    spinner.fail('Compilation failed!');
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

/**
 * check is window admin
 */
async function isAdmin() {
  if (process.platform !== 'win32') {
    return false;
  }

  try {
    // https://stackoverflow.com/a/21295806/1641422
    await execa('fsutil', ['dirty', 'query', process.env.systemdrive]);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return testFltmc();
    }

    return false;
  }
}

async function testFltmc() {
  try {
    await execa('fltmc');
    return true;
  } catch {
    return false;
  }
}
