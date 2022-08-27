import { Col, Row, Switch } from 'antd';
import React from 'react';

interface PermissionItemProps {
  title: string;
  desc?: string;
  disabled?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const PermissionItem: React.FC<PermissionItemProps> = React.memo(
  (props) => {
    return (
      <div className="mx-2 py-3 border-b border-white border-opacity-20">
        <Row>
          <Col flex={1} className="font-bold">
            {props.title}
          </Col>

          <Col>
            <Switch
              disabled={props.disabled}
              checked={props.checked}
              onChange={props.onChange}
            />
          </Col>
        </Row>

        <div className="text-gray-400">{props.desc}</div>
      </div>
    );
  }
);
PermissionItem.displayName = 'PermissionItem';
