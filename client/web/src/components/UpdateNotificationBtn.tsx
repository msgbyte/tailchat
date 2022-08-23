import React from 'react';
import { Button, Space } from 'antd';
import { t } from 'tailchat-shared';

/**
 * sw更新提示的按钮
 */
export const UpdateNotificationBtn: React.FC = React.memo(() => {
  return (
    <Space>
      <Button
        type="primary"
        size="small"
        onClick={() => window.location.reload()}
      >
        {t('立即刷新')}
      </Button>
    </Space>
  );
});
UpdateNotificationBtn.displayName = 'UpdateNotificationBtn';
