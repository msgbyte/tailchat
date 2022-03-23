import ts from 'typescript';
import fs from 'fs-extra';

/**
 * Tools: https://ts-ast-viewer.com/
 */

interface ExportModuleItem {
  name: string;
  comment?: string;
}

/**
 * 解析文件
 */
export function parseFile(filePath: string, options: ts.CompilerOptions) {
  const host = new FileServiceHost(filePath, options);

  const service = ts.createLanguageService(host, ts.createDocumentRegistry());
  const program = service.getProgram();

  const exportModules: ExportModuleItem[] = [];
  const sourceFile = program?.getSourceFile(filePath);
  sourceFile?.forEachChild((node) => {
    if (ts.isExportDeclaration(node)) {
      // 如果为导出声明: export { foo } from 'foo'
      node.exportClause?.forEachChild((exportSpec) => {
        if (ts.isExportSpecifier(exportSpec)) {
          exportModules.push({
            name: exportSpec.name.text,
            // comment:
          });
        }
      });
    } else if (isExportFunc(node)) {
      // 如果是方法导出: export function foo() {}
      if (node.name) {
        exportModules.push({
          name: node.name.text,
          comment: getNodeComments(node),
        });
      }
    }
  });

  return { exportModules };
}

function isExportFunc(node: ts.Node): node is ts.FunctionDeclaration {
  if (ts.isFunctionDeclaration(node)) {
    if (node.modifiers) {
      return node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    }
  }

  return false;
}

function getNodeComments(node: ts.Node): string | undefined {
  const comments = ts.getSyntheticLeadingComments(node);

  if (!comments) {
    return undefined;
  }

  return comments.map((c) => c.text).join('\n');
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
