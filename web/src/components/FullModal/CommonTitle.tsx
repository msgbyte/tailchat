import React from 'react';

interface FullModalCommonTitleProps {
  extra?: React.ReactNode;
}
export const FullModalCommonTitle: React.FC<FullModalCommonTitleProps> =
  React.memo((props) => {
    return (
      <div className="text-xl font-bold mb-4 flex justify-between">
        <div>{props.children}</div>
        <div>{props.extra}</div>
      </div>
    );
  });
FullModalCommonTitle.displayName = 'FullModalCommonTitle';
