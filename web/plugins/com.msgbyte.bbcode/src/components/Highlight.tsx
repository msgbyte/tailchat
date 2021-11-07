import React from 'react';
import CodeRender from 'react-highlight';

import 'highlight.js/styles/default.css';

const Highlight: React.FC<{
  language: string;
  code: string;
}> = React.memo((props) => {
  const CodeComponent = (CodeRender as any).default as typeof CodeRender; // TODO: ministar编译问题，先跳过
  return <CodeComponent className={props.language}>{props.code}</CodeComponent>;
});
Highlight.displayName = 'Highlight';

export default Highlight;
