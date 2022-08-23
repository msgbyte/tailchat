import { LoadingSpinner } from '@/components/LoadingSpinner';
import { pluginInspectServices } from '@/plugin/common';
import { Icon } from '@/components/Icon';
import React, { useMemo } from 'react';
import { t, useAvailableServices } from 'tailchat-shared';

/**
 * 默认检查服务列表
 */
const DEFAULT_SERVICES = [
  {
    name: 'config',
    label: t('全局配置'),
  },
  {
    name: 'gateway',
    label: t('服务网关'),
  },
  {
    name: 'user',
    label: t('用户服务'),
  },
  {
    name: 'user.dmlist',
    label: t('私信服务'),
  },
  {
    name: 'chat.message',
    label: t('聊天服务'),
  },
  {
    name: 'chat.converse',
    label: t('会话服务'),
  },
  {
    name: 'chat.ack',
    label: t('已读服务'),
  },
  {
    name: 'friend',
    label: t('好友服务'),
  },
  {
    name: 'group',
    label: t('群组服务'),
  },
  {
    name: 'group.invite',
    label: t('群组邀请服务'),
  },
  {
    name: 'file',
    label: t('文件服务'),
  },
  {
    name: 'mail',
    label: t('邮件服务'),
  },
  {
    name: 'plugin.registry',
    label: t('插件中心服务'),
  },
];

/**
 * 服务状态
 */
export const SettingsStatus: React.FC = React.memo(() => {
  const inspectServices = useMemo(
    () => [...DEFAULT_SERVICES, ...pluginInspectServices],
    []
  ); // 需要检查服务状态的列表

  const { loading, availableServices } = useAvailableServices();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {inspectServices.map((service) => (
        <div key={service.name} className="flex items-center">
          <span className="mr-1">{service.label}:</span>
          {availableServices?.includes(service.name) ? (
            <span title={t('当前服务可用')}>
              <Icon icon="emojione:white-heavy-check-mark" />
            </span>
          ) : (
            <span title={t('服务异常')}>
              <Icon icon="emojione:cross-mark-button" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
});
SettingsStatus.displayName = 'SettingsStatus';
