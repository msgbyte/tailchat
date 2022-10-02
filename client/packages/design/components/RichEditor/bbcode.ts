import { isArray, ObjectMark, RemirrorJSON } from 'remirror';

/**
 * 转换成BBCode
 */
export function transformToBBCode(json: RemirrorJSON): string {
  if (json.type === 'doc') {
    return (json.content ?? []).map(transformToBBCode).join('\n');
  }

  if (json.type === 'paragraph') {
    return (json.content ?? []).map(transformToBBCode).join('');
  }

  if (json.type === 'text') {
    let text = json.text ?? '';

    if (isArray(json.marks)) {
      (json.marks ?? []).forEach((mark) => {
        if (typeof mark === 'string') {
          mark = { type: mark };
        }
        text = applyMarks(mark, text);
      });
    }

    return text;
  }

  return '';
}

/**
 * 为text增加mark包裹
 */
function applyMarks(mark: ObjectMark, text: string): string {
  if (mark.type === 'bold') {
    return `[b]${text}[/b]`;
  }
  if (mark.type === 'underline') {
    return `[u]${text}[/u]`;
  }
  if (mark.type === 'italic') {
    return `[i]${text}[/i]`;
  }
  if (mark.type === 'code') {
    return `[code]${text}[/code]`;
  }

  return text;
}
