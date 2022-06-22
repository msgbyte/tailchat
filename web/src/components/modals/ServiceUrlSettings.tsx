import { Button, Input } from 'antd';
import React, { useState } from 'react';
import { t } from 'tailchat-shared';
import { ModalWrapper } from '../Modal';

export const ServiceUrlSettings: React.FC = React.memo(() => {
  const [url, setUrl] = useState(
    window.localStorage.getItem('serviceUrl') ?? ''
  );

  return (
    <ModalWrapper title={t('服务端地址')}>
      <Input
        placeholder={t('请输入服务器地址(示例: http://127.0.0.1:11000)')}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <div className="space-x-2 text-right mt-8">
        <Button
          onClick={() => {
            window.localStorage.removeItem('serviceUrl');
            window.location.reload();
          }}
        >
          {t('重置为默认地址')}
        </Button>
        <Button
          type="primary"
          disabled={!url}
          onClick={() => {
            window.localStorage.setItem('serviceUrl', url);
            window.location.reload();
          }}
        >
          {t('确认修改并刷新页面')}
        </Button>
      </div>
    </ModalWrapper>
  );
});
ServiceUrlSettings.displayName = 'ServiceUrlSettings';
