import React from 'react';

export const Highlight: React.FC = React.memo((props) => {
  return (
    <span className="bg-black bg-opacity-20 rounded py-1 px-2">
      {props.children}
    </span>
  );
});
Highlight.displayName = 'Highlight';
