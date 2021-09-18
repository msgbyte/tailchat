import DevContainer from '@/components/DevContainer';
import { FullModalField } from '@/components/FullModal/Field';
import { Select } from 'antd';
import React, { useCallback } from 'react';
import { showToasts, t, useColorScheme } from 'tailchat-shared';
import { useLanguage } from 'tailchat-shared';

export const SettingsSystem: React.FC = React.memo(() => {
  const { language, setLanguage } = useLanguage();
  const { colorScheme, setColorScheme } = useColorScheme();

  const handleChangeLanguage = useCallback(
    (newLang: string) => {
      showToasts(t('刷新页面后生效'), 'info');
      setLanguage(newLang);
    },
    [setLanguage]
  );

  return (
    <div>
      <FullModalField
        title={t('系统语言')}
        content={
          <Select
            style={{ width: 300 }}
            size="large"
            value={language}
            onChange={handleChangeLanguage}
          >
            <Select.Option value="zh-CN">简体中文</Select.Option>
            <Select.Option value="en-US">English</Select.Option>
          </Select>
        }
      />

      <DevContainer>
        <FullModalField
          title={t('配色方案')}
          content={
            <Select
              style={{ width: 300 }}
              size="large"
              value={colorScheme}
              onChange={setColorScheme}
            >
              <Select.Option value="dark">{t('暗黑模式')}</Select.Option>
              <Select.Option value="light">{t('亮色模式')}</Select.Option>
              <Select.Option value="auto">{t('自动')}</Select.Option>
            </Select>
          }
        />
      </DevContainer>
    </div>
  );
});
SettingsSystem.displayName = 'SettingsSystem';
