import { Icon } from '@iconify/react';
import { t } from 'tailchat-shared';
import React from 'react';

/**
 * 正在开发中的功能
 * 占位符
 */
export const IsDeveloping: React.FC = React.memo(() => {
  return (
    <div className="text-white w-full h-full flex items-center justify-center flex-col">
      <Icon className="text-9xl" icon="mdi-code-braces" />
      <p className="text-2xl">{t('该功能暂未开放')}</p>
    </div>
  );
});
IsDeveloping.displayName = 'IsDeveloping';
