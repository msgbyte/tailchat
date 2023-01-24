import { SourceFile, SyntaxKind, TypeReferenceNode } from 'ts-morph';
import { getMethodParameters } from './utils';

/**
 * 解析并处理 service 文件, 把所有的 Action 都自动加上jsdoc
 */
export async function processService(sourceFile: SourceFile) {
  const serviceNameDeclaration = sourceFile
    .getDescendantsOfKind(SyntaxKind.GetAccessor)
    .find((item) => item.getSymbol().getName() === 'serviceName');

  if (!serviceNameDeclaration) {
    // 没有定义 serviceName, 不是一个正确的服务，跳过
    return;
  }

  // 目前只先视为一个文件只有一个service，不考虑多个
  const serviceName = serviceNameDeclaration
    .getFirstDescendantByKind(SyntaxKind.ReturnStatement)
    .getExpression()
    .asKindOrThrow(SyntaxKind.StringLiteral)
    .getLiteralText();

  console.log('process service:', serviceName);

  const actions = findActionMethods(sourceFile);

  for (const action of actions) {
    const jsdocs = action.getJsDocs();
    const len = jsdocs.length;
    const lastJsDoc = jsdocs[len - 1]; // 最后一条记录
    if (lastJsDoc && lastJsDoc.getText().includes('@swagger')) {
      continue;
    }

    const actionName = action.getSymbol().getEscapedName();

    const requestTypeReferenceNode = action
      .getFirstChildByKind(SyntaxKind.Parameter)
      .getFirstChildByKind(SyntaxKind.TypeReference);

    const text = generateOpenapiSchemaText(
      serviceName,
      actionName,
      lastJsDoc?.getCommentText().replaceAll('\n', ' ') ?? '',
      getPropertySignatureToSwagger(requestTypeReferenceNode)
    );

    if (lastJsDoc) {
      // 移除以前的注释
      lastJsDoc.remove();
    }

    // 将之前的描述填写到里面
    action.addJsDoc(text);
  }

  await sourceFile.save(); // 将改动保存到原文件中
}

/**
 * 获取Action方法列表
 */
function findActionMethods(sourceFile: SourceFile) {
  const actions = sourceFile
    .getDescendantsOfKind(SyntaxKind.MethodDeclaration)
    .filter((item) => {
      const parameters = getMethodParameters(item);
      if (
        parameters.length === 1 &&
        ['TcPureContext', 'TcContext'].includes(
          parameters[0].getType().getSymbol().getEscapedName()
        )
      ) {
        return true;
      }

      return false;
    });

  return actions;
}

interface SwaggerParamType {
  name: string;
  type: 'string' | 'integer' | 'string[]' | 'integer[]'; // https://graphql-faas.github.io/OpenAPI-Specification/versions/2.0.html#data-types
}

function generateOpenapiSchemaText(
  serviceName: string,
  actionName: string,
  description: string,
  requestParams: SwaggerParamType[],
  responseParams?: 'boolean' | SwaggerParamType[]
) {
  actionName = actionName.replaceAll('.', '/');

  const responseData = responseParams
    ? responseParams === 'boolean'
      ? `data:
  type: boolean`
      : `data:
  type: object
  properties:
    ${generateProperties(responseParams, 4)}`
    : '';

  return `@swagger

/api/${actionName}/${serviceName}:
  post:
    tags:
      - ${actionName}
    description: ${description}
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              ${generateProperties(requestParams, 14)}
    responses:
      200:
        content:
          application/json:
            schema:
              type: object
              properties:
                code:
                  type: integer
                  example: 200
                message:
                  type: string
                  example: ok
                ${paddingWithIndent(responseData, 16)}
`;
}

function generateProperties(
  params: SwaggerParamType[],
  indent: number
): string {
  return paddingWithIndent(
    params
      .map((p) => {
        if (p.type.endsWith('[]')) {
          const t = p.type.substring(0, p.type.length - 2);
          return `${p.name}:
  type: array
  items:
    type: ${t}`;
        } else {
          return `${p.name}:
  type: ${p.type}`;
        }
      })
      .join('\n'),
    indent
  );
}

function paddingWithIndent(text: string, indent: number) {
  let indentText = '';
  Array.from({ length: indent }).forEach(() => {
    indentText += ' ';
  });

  return text.split('\n').join('\n' + indentText);
}

/**
 * 将ts的类型转换为swagger可以认识的类型
 */
function getPropertySignatureToSwagger(
  typeReferenceNode: TypeReferenceNode
): SwaggerParamType[] {
  if (!typeReferenceNode) {
    return [];
  }

  return typeReferenceNode
    .getDescendantsOfKind(SyntaxKind.PropertySignature)
    .map((item) => {
      const name = item.getName();
      const type = item.getType();

      let typeText: SwaggerParamType['type'] = 'string';
      if (type.isArray()) {
        typeText = 'string[]';

        if (type.isNumber()) {
          typeText = 'integer[]';
        }
      } else {
        if (type.isNumber()) {
          typeText = 'integer';
        }
      }

      return {
        name,
        type: typeText,
      };
    });
}
