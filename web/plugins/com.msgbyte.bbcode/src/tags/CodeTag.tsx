import React from 'react';
import type { TagProps } from '../bbcode/type';

const Highlight = React.lazy(() => import('../components/Highlight'));

export const CodeTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const text = node.content.join('');
  const language = node.attrs.language ?? 'bash';

  return <Highlight language={language} code={text} />;
});
CodeTag.displayName = 'CodeTag';
