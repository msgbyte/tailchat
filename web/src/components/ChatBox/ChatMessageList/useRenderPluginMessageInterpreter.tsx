import { messageInterpreter } from '@/plugin/common';
import { Icon } from '@iconify/react';
import { Popover } from 'antd';
import React from 'react';
import { useMemo } from 'react';
import { t } from 'tailchat-shared';

export function useRenderPluginMessageInterpreter(message: string) {
  const availableInterpreter = useMemo(
    () =>
      messageInterpreter
        .map(({ name, explainMessage }) => ({
          name,
          render: explainMessage(message),
        }))
        .filter(({ render }) => render !== null),
    [message]
  );

  if (availableInterpreter.length === 0) {
    return null;
  }

  return (
    <span className="align-middle hidden group-hover:inline-block">
      <Popover
        placement="topLeft"
        title={t('消息解释')}
        content={
          <div className="max-w-lg">
            {availableInterpreter.map((ai, i) => (
              <p key={i + (ai.name ?? '')}>
                {ai.name && (
                  <span>
                    {t('来自')} <span className="font-bold">{ai.name}</span> :{' '}
                  </span>
                )}
                {ai.render}
              </p>
            ))}
          </div>
        }
        trigger="click"
      >
        <Icon
          className="cursor-pointer text-base"
          icon="mdi:file-question-outline"
        />
      </Popover>
    </span>
  );
}
