import {
  Project,
  ProjectOptions,
  Symbol,
  SyntaxKind,
  ts,
  Type,
} from 'ts-morph';

interface Options {
  entryPath: string;
  project?: ProjectOptions;
  hardcodeExportType?: Record<string, string>;
}

export function parseDeclarationEntry(options: Options) {
  const project = new Project(options.project);
  const sourceFile = project.getSourceFileOrThrow(options.entryPath);
  const hardcodeExportType = options.hardcodeExportType ?? {};

  const exportDefs: { name: string; type: string }[] = [];
  for (const [name, declarations] of sourceFile.getExportedDeclarations()) {
    if (hardcodeExportType[name]) {
      exportDefs.push({
        name,
        type: hardcodeExportType[name],
      });
      continue;
    }

    console.log('parsing:', name);

    const typeDef = declarations
      .map((d) => {
        if (d.isKind(SyntaxKind.FunctionDeclaration)) {
          // 如果是方法导出
          return d
            .getType()
            .getCallSignatures()
            .map((s) => {
              let fnText = '';
              const typeParameters = s.getTypeParameters();
              if (typeParameters.length > 0) {
                fnText += `<${typeParameters
                  .map((tp) => tp.getText())
                  .join(', ')}>`;
              }

              fnText += `(${s
                .getParameters()
                .map((p) => {
                  return parseFunctionParameter(p);
                })
                .join(', ')}) => ${s.getReturnType().getText()}`;

              return fnText;
            })
            .join(' | ');
        } else {
          // 其他
          return d.getType().getText();
        }
      })
      .join(' | ');

    exportDefs.push({
      name,
      type: typeDef,
    });
  }

  return { exportDefs, project };
}

/**
 * 解析函数参数为字符串
 */
function parseFunctionParameter(parameter: Symbol): string {
  const name = parameter.getName();
  const isOptional = parameter.isOptional();
  const type = parseType(parameter.getDeclarations()[0].getType());

  if (isOptional) {
    return `${name}?: ${type}`;
  } else {
    return `${name}: ${type}`;
  }
}

/**
 * 解析函数
 */
function parseType(type: Type<ts.Type>): string {
  if (type.isAnonymous()) {
    return type.getText();
  }

  if (type.isObject()) {
    const properties = type.getApparentProperties();
    debugger;

    return `{ ${properties
      .map((p) => {
        const t = p.getDeclarations()[0].getType();
        const text = parseType(t);
        return `${p.getName()}: ${text}`;
      })
      .join(', ')} }`;
  }

  return type.getText();
}
