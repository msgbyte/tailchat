import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Icon } from '@iconify/react';
import React from 'react';
import { fetchAvailableServices, t, useAsync } from 'tailchat-shared';

/**
 * 检查服务列表
 */
const SERVICES = [
  {
    name: 'user',
    label: t('用户服务'),
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
];

/**
 * 服务状态
 */
export const SettingsStatus: React.FC = React.memo(() => {
  const { loading, value: availableServices } = useAsync(async () => {
    const services = await fetchAvailableServices();

    return services;
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {SERVICES.map((service) => (
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
