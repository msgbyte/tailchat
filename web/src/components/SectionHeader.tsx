import React, { useState } from 'react';
import { Dropdown } from 'antd';
import { Icon } from '@/components/Icon';
import clsx from 'clsx';

interface SectionHeaderProps {
  menu?: React.ReactElement;
}

export const SectionHeader: React.FC<SectionHeaderProps> = React.memo(
  (props) => {
    const [visible, setVisible] = useState(false);
    return (
      <div className="h-12 relative flex items-center py-0 text-base font-bold flex-shrink-0 thin-line-bottom">
        {React.isValidElement(props.menu) ? (
          <Dropdown
            onVisibleChange={setVisible}
            overlay={props.menu}
            placement="topRight"
            trigger={['click']}
          >
            <div className="cursor-pointer flex flex-1">
              <header className="flex-1 truncate px-4">{props.children}</header>
              <Icon
                className={clsx('text-2xl transition-transform transform', {
                  'rotate-180': visible,
                })}
                icon="mdi:chevron-down"
              >
                &#xe60f;
              </Icon>
            </div>
          </Dropdown>
        ) : (
          <header className="flex-1 truncate px-4">{props.children}</header>
        )}
      </div>
    );
  }
);
SectionHeader.displayName = 'SectionHeader';
