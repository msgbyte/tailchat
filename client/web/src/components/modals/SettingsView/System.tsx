import { FullModalFactory } from '@/components/FullModal/Factory';
import { FullModalField } from '@/components/FullModal/Field';
import { LanguageSelect } from '@/components/LanguageSelect';
import { pluginColorScheme, pluginSettings } from '@/plugin/common';
import { Select, Switch, Button } from 'antd';
import React from 'react';
import {
  t,
  useAlphaMode,
  useColorScheme,
  useUserSettings,
} from 'tailchat-shared';
import _get from 'lodash/get';

export const SettingsSystem: React.FC = React.memo(() => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { settings, setSettings, loading } = useUserSettings();
  const { isAlphaMode, setAlphaMode } = useAlphaMode();

  return (
    <div>
      <FullModalField title={t('系统语言')} content={<LanguageSelect />} />

      <FullModalField
        title={t('配色方案')}
        content={
          <Select
            style={{ width: 280 }}
            size="large"
            value={colorScheme}
            onChange={setColorScheme}
          >
            <Select.Option value="dark">{t('暗黑模式')}</Select.Option>
            <Select.Option value="light">{t('亮色模式')}</Select.Option>
            <Select.Option value="auto">{t('自动')}</Select.Option>
            {pluginColorScheme.map((pcs, i) => (
              <Select.Option key={pcs.name + i} value={pcs.name}>
                {pcs.label}
              </Select.Option>
            ))}
          </Select>
        }
      />

      <FullModalField
        title={t('关闭消息右键菜单')}
        content={
          <Switch
            checked={settings['disableMessageContextMenu'] ?? false}
            onChange={(checked) =>
              setSettings({
                disableMessageContextMenu: checked,
              })
            }
          />
        }
      />

      {pluginSettings
        .filter((item) => item.position === 'system')
        .map((item) => {
          return (
            <FullModalFactory
              key={item.name}
              value={_get(settings, item.name, item.defaultValue ?? false)}
              onChange={(val) => {
                setSettings({
                  [item.name]: val,
                });
              }}
              config={item}
            />
          );
        })}

      <FullModalField
        title={t('Alpha测试开关')}
        tip={t(
          '在 Alpha 模式下会有一些尚处于测试阶段的功能将会被开放，如果出现问题欢迎反馈'
        )}
        content={
          <Switch
            checked={isAlphaMode}
            onChange={(checked) => setAlphaMode(checked)}
          />
        }
      />

      {isAlphaMode && (
        <FullModalField
          title={t('聊天列表虚拟化') + ' (Beta)'}
          content={
            <Switch
              disabled={loading}
              loading={loading}
              checked={settings.messageListVirtualization ?? false}
              onChange={(checked) =>
                setSettings({
                  messageListVirtualization: checked,
                })
              }
            />
          }
        />
      )}
      <Button type="primary" onClick={() => window.location.reload()}>
        {t('重新加载')}
      </Button>
    </div>
  );
});
SettingsSystem.displayName = 'SettingsSystem';
