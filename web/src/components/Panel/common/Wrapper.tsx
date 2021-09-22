import React, { useState } from 'react';
import { PanelCommonHeader } from '../common/Header';
import { Icon } from '@iconify/react';
import { Button } from 'antd';
import clsx from 'clsx';

interface RightPanelType {
  name: string;
  panel: React.ReactNode;
}

/**
 * 面板通用包装器
 */
interface CommonPanelWrapperProps {
  header: React.ReactNode;
  actions: (
    setRightPanel: (info: RightPanelType) => void
  ) => React.ReactElement[];
}
export const CommonPanelWrapper: React.FC<CommonPanelWrapperProps> = React.memo(
  (props) => {
    const [rightPanel, setRightPanel] = useState<RightPanelType>();

    return (
      <div className="w-full h-full flex">
        {/* 主面板 */}
        <div className="flex flex-col overflow-hidden flex-1">
          <PanelCommonHeader actions={props.actions(setRightPanel)}>
            {props.header}
          </PanelCommonHeader>
          <div className="flex-1 overflow-hidden">{props.children}</div>
        </div>

        {/* 右侧面板 */}
        <div
          className={clsx(
            'transition-all overflow-hidden border-l border-black border-opacity-20',
            {
              'w-96 mobile:w-full': rightPanel,
              'w-0': !rightPanel,
            }
          )}
        >
          <PanelCommonHeader
            actions={[
              // 关闭按钮
              <Button
                key="close"
                icon={<Icon className="anticon text-2xl" icon="mdi:close" />}
                onClick={() => setRightPanel(undefined)}
              />,
            ]}
          >
            {rightPanel?.name}
          </PanelCommonHeader>
          {rightPanel?.panel}
        </div>
      </div>
    );
  }
);
CommonPanelWrapper.displayName = 'CommonPanelWrapper';
