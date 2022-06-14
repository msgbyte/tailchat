import ts from 'typescript';
import fs from 'fs-extra';

/**
 * Tools: https://ts-ast-viewer.com/
 */

interface ExportModuleItem {
  name: string;
  comment?: string;
}

export function parseModuleDeclaration(
  filePath: string,
  options: ts.CompilerOptions
) {
  const program = parseFile(filePath, options);
  const modules: Record<string, any[]> = {};

  const sourceFile = program?.getSourceFile(filePath);
  sourceFile?.forEachChild((node) => {
    if (
      ts.isModuleDeclaration(node) &&
      node.body &&
      ts.isModuleBlock(node.body)
    ) {
      const moduleName = node.name.text;
      if (!modules[moduleName]) {
        modules[moduleName] = [];
      }

      node.body.forEachChild((item) => {
        if (ts.isVariableStatement(item)) {
          item.declarationList.declarations.forEach((declaration) => {
            const name = declaration.name.getText();
            modules[moduleName].push(name);
          });
        }
      });
    }
  });

  return { modules };
}

/**
 * 解析导出文件
 */
export function parseExports(filePath: string, options: ts.CompilerOptions) {
  const program = parseFile(filePath, options);

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

/**
 * 解析文件
 */
export function parseFile(filePath: string, options: ts.CompilerOptions) {
  const host = new FileServiceHost(filePath, options);

  const service = ts.createLanguageService(host, ts.createDocumentRegistry());
  const program = service.getProgram();

  return program;
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
