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
}

export function parseDeclarationEntry(options: Options) {
  const project = new Project(options.project);
  const sourceFile = project.getSourceFileOrThrow(options.entryPath);

  for (const [name, declarations] of sourceFile.getExportedDeclarations()) {
    console.log(
      `${name}: ${declarations
        .map((d) => {
          if (d.isKind(SyntaxKind.FunctionDeclaration)) {
            return d
              .getType()
              .getCallSignatures()
              .map(
                (s) =>
                  `(${s
                    .getParameters()
                    .map((s) => parseFunctionParameter(s))
                    .join(', ')}) => ${s.getReturnType().getText()}`
              )
              .join(' | ');
          } else {
            return d.getType().getText();
          }
        })
        .join(' | ')}`
    );
  }

  return project;
}

/**
 * 解析函数参数为字符串
 */
function parseFunctionParameter(parameter: Symbol): string {
  debugger;
  parameter.getFlags();

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
  if (type.isObject()) {
    const properties = type.getApparentProperties();
    return `{ ${properties
      .map(
        (p) => `${p.getName()}: ${parseType(p.getDeclarations()[0].getType())}`
      )
      .join(', ')} }`;
  }

  return type.getText();
}
