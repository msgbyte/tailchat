import React, { PropsWithChildren } from 'react';

interface CommonSidebarProps extends PropsWithChildren {
  ['data-tc-role']?: string;
}
export const CommonSidebarWrapper: React.FC<CommonSidebarProps> = React.memo(
  (props) => {
    return (
      <div
        className="h-full flex flex-col"
        data-tc-role={props['data-tc-role']}
      >
        {props.children}
      </div>
    );
  }
);
CommonSidebarWrapper.displayName = 'CommonSidebarWrapper';
