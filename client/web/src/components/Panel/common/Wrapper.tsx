import React, { PropsWithChildren, useState } from 'react';
import { PanelCommonHeader } from '../common/Header';
import clsx from 'clsx';
import { useIsMobile } from '@/hooks/useIsMobile';
import { IconBtn } from '@/components/IconBtn';

interface RightPanelType {
  name: string;
  panel: React.ReactNode;
}

/**
 * 面板通用包装器
 */
export interface CommonPanelWrapperProps extends PropsWithChildren {
  header: React.ReactNode;
  actions?: (ctx: {
    setRightPanel: (info: RightPanelType) => void;
  }) => React.ReactElement[];
}
export const CommonPanelWrapper: React.FC<CommonPanelWrapperProps> = React.memo(
  (props) => {
    const [rightPanel, setRightPanel] = useState<RightPanelType>();
    const isMobile = useIsMobile();

    return (
      <div
        className="w-full h-full flex"
        style={{
          minWidth: isMobile && !rightPanel ? 'calc(100vw - 72px)' : 0,
        }} // NOTICE: 72px为导航栏宽度
      >
        {/* 主面板 */}
        <div className="flex flex-col overflow-hidden flex-1">
          <PanelCommonHeader
            actions={props.actions && props.actions({ setRightPanel })}
          >
            {props.header}
          </PanelCommonHeader>
          <div className="flex-1 overflow-hidden">{props.children}</div>
        </div>

        {/* 右侧面板 */}
        <div
          className={clsx(
            'transition-all overflow-hidden border-l border-black border-opacity-20 flex flex-col',
            {
              'w-96 mobile:w-full': rightPanel,
              'w-0': !rightPanel,
            }
          )}
        >
          <PanelCommonHeader
            actions={[
              // 关闭按钮
              <IconBtn
                key="close"
                shape="square"
                icon="mdi:close"
                iconClassName="text-2xl"
                onClick={() => setRightPanel(undefined)}
              />,
            ]}
          >
            {rightPanel?.name}
          </PanelCommonHeader>

          <div className="flex-1 overflow-y-auto">{rightPanel?.panel}</div>
        </div>
      </div>
    );
  }
);
CommonPanelWrapper.displayName = 'CommonPanelWrapper';
