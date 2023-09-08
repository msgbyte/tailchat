import { Collapse } from 'antd';
import React from 'react';

interface CollapseViewProps extends React.PropsWithChildren {
  title: string;
  className?: string;
}
export const CollapseView: React.FC<CollapseViewProps> = React.memo((props) => {
  return (
    <Collapse className={props.className}>
      <Collapse.Panel header={props.title} key="main">
        {props.children}
      </Collapse.Panel>
    </Collapse>
  );
});
CollapseView.displayName = 'CollapseView';
