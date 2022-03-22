import ts from 'typescript';
import fs from 'fs-extra';

/**
 * 解析文件
 */
export function parseFile(filePath: string, options: ts.CompilerOptions) {
  const host = new FileServiceHost(filePath, options);

  const service = ts.createLanguageService(host, ts.createDocumentRegistry());
  const program = service.getProgram();

  const exportModules: string[] = [];
  program?.getSourceFile(filePath)?.forEachChild((node) => {
    if (ts.isExportDeclaration(node)) {
      node.exportClause?.forEachChild((exportSpec) => {
        if (ts.isExportSpecifier(exportSpec)) {
          exportModules.push(exportSpec.name.text);
        }
      });
    }
  });

  return { exportModules };
}

class FileServiceHost implements ts.LanguageServiceHost {
  constructor(public filePath: string, private options: ts.CompilerOptions) {}

  getCompilationSettings = () => this.options;
  getScriptFileNames = () => [
    this.filePath,
    // '/Users/moonrailgun/inventory/tailchat/packages/plugin-declaration-generator/test/demo/foo.ts',
  ];
  getScriptVersion = () => '1';
  getScriptSnapshot = (fileName: string) => {
    if (!fs.existsSync(fileName)) {
      return undefined;
    }

    return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
  };
  getCurrentDirectory = () => '';
  getDefaultLibFileName = (options: ts.CompilerOptions) =>
    ts.getDefaultLibFilePath(options);

  readFile(path: string): string | undefined {
    return fs.readFileSync(path).toString();
  }
  fileExists(path: string): boolean {
    return fs.existsSync(path);
  }
}
