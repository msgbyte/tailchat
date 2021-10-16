import { Button, Result } from 'antd';
import React from 'react';
import { t } from 'tailchat-shared';

interface OpenedPanelTipProps {
  onClosePanelWindow: () => void;
}

/**
 * 该面板已被打开提示
 */
export const OpenedPanelTip: React.FC<OpenedPanelTipProps> = React.memo(
  (props) => {
    return (
      <Result
        className="w-full"
        title={t('当前面板已在独立窗口打开')}
        extra={
          <Button onClick={props.onClosePanelWindow}>
            {t('关闭独立窗口')}
          </Button>
        }
      />
    );
  }
);
OpenedPanelTip.displayName = 'OpenedPanelTip';
