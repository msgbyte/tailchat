import { Collapse } from 'antd';
import React from 'react';

interface CollapseViewProps extends React.PropsWithChildren {
  title: string;
  className?: string;
  style?: React.CSSProperties;
}
export const CollapseView: React.FC<CollapseViewProps> = React.memo((props) => {
  return (
    <Collapse className={props.className} style={props.style}>
      <Collapse.Panel header={props.title} key="main">
        {props.children}
      </Collapse.Panel>
    </Collapse>
  );
});
CollapseView.displayName = 'CollapseView';
