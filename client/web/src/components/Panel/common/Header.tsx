import { SectionHeader } from '@/components/SectionHeader';
import { Space } from 'antd';
import React from 'react';

interface PanelCommonHeaderProps {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  actions?: React.ReactNode[];
}

/**
 * 右侧面板的头部
 */
export const PanelCommonHeader: React.FC<PanelCommonHeaderProps> = React.memo(
  (props) => {
    return (
      <SectionHeader>
        <div className="flex flex-wrap text-xl justify-between">
          <div className="flex items-center">
            <div className="text-gray-500 mr-1">{props.prefix}</div>
            <div className="text-base">{props.children}</div>
            <div className="ml-2">{props.suffix}</div>
          </div>

          <Space>{props.actions}</Space>
        </div>
      </SectionHeader>
    );
  }
);
PanelCommonHeader.displayName = 'PanelCommonHeader';
