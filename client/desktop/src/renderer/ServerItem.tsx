import React from 'react';
import './ServerItem.css';

export const ServerItem: React.FC<
  React.PropsWithChildren<{
    icon: string;
    version?: string;
    onClick: () => void;
  }>
> = React.memo((props) => {
  return (
    <div className="server-item" onClick={props.onClick}>
      <div>
        <img width="60px" height="60px" alt="icon" src={props.icon} />
      </div>
      <div>{props.children}</div>
      <div>
        <small title={props.version}>{props.version}</small>
      </div>
    </div>
  );
});
ServerItem.displayName = 'ServerItem';
