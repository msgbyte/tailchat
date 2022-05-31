import bbcodeParser from './parser';
import type { AstNode } from './type';
import _isNil from 'lodash/isNil';

function bbcodeNodeToPlainText(node: AstNode): string {
  if (_isNil(node)) {
    return '';
  }

  if (typeof node === 'string') {
    return String(node);
  } else {
    if (node.tag === 'img') {
      return '[图片]';
    }
    if (node.tag === 'emoji') {
      return `:${node.content.join('')}:`;
    }
    if (node.tag === 'at') {
      return `@${node.content.join('')}`;
    }

    return (node.content ?? [])
      .map((sub) => bbcodeNodeToPlainText(sub))
      .join('');
  }
}

/**
 * 将 BBCode 转化为普通的字符串
 */
export function bbcodeToPlainText(bbcode: string): string {
  const ast = bbcodeParser.parse(bbcode);

  return ast.map(bbcodeNodeToPlainText).join('');
}
