import React, { useState } from 'react';
import { Dropdown } from 'antd';
import { Icon } from '@iconify/react';

interface SectionHeaderProps {
  menu?: React.ReactElement;
}

export const SectionHeader: React.FC<SectionHeaderProps> = React.memo(
  (props) => {
    const [visible, setVisible] = useState(false);
    return (
      <div className="h-12 relative flex items-center px-4 py-0 text-base font-bold flex-shrink-0 thin-line-bottom">
        {React.isValidElement(props.menu) ? (
          <Dropdown
            visible={visible}
            onVisibleChange={setVisible}
            overlay={props.menu}
            placement="topRight"
            trigger={['click']}
          >
            <div className="cursor-pointer flex flex-1">
              <header className="flex-1 truncate">{props.children}</header>
              <Icon className="text-2xl" icon="mdi-chevron-down">
                &#xe60f;
              </Icon>
            </div>
          </Dropdown>
        ) : (
          <header className="flex-1 truncate">{props.children}</header>
        )}
      </div>
    );
  }
);
SectionHeader.displayName = 'SectionHeader';
