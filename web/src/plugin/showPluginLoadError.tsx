import { notification } from 'antd';
import React from 'react';
import { t } from 'tailchat-shared';

export function showPluginLoadError(loadErrorPluginNames: string[]) {
  notification.warn({
    message: (
      <div>
        <p>{t('插件加载失败')}:</p>

        {loadErrorPluginNames.map((name) => (
          <p key={name}>- {name}</p>
        ))}
      </div>
    ),
    duration: 2,
  });
}
