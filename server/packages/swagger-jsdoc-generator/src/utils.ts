import { MethodDeclaration, ParameterDeclaration, SyntaxKind } from 'ts-morph';

/**
 * 获取函数参数列表
 */
export function getMethodParameters(
  methodDeclaration: MethodDeclaration
): ParameterDeclaration[] {
  return methodDeclaration.getChildrenOfKind(SyntaxKind.Parameter);
}
