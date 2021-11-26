import { Button, Input } from 'antd';
import React, { useMemo, useState } from 'react';
import { isValidJson, showToasts, t, useAsyncRequest } from 'tailchat-shared';
import { pluginManager } from '../manager';
import { parsePluginManifest } from '../utils';

/**
 * 手动安装
 */
export const ManualInstall: React.FC = React.memo(() => {
  const [json, setJson] = useState('');

  const [{ loading }, handleInstallPlugin] = useAsyncRequest(async () => {
    pluginManager.installPlugin(parsePluginManifest(json));
    showToasts(t('安装成功'), 'success');
  }, [json]);

  const invalid = useMemo(() => !isValidJson(json), [json]);

  return (
    <div className="p-2">
      <Input.TextArea
        placeholder={t(
          '请手动输入JSON信息，如果你不明确你在做什么请不要使用该功能'
        )}
        disabled={loading}
        value={json}
        onChange={(e) => setJson(e.target.value)}
        rows={18}
      />

      <div className="text-red-500">
        {invalid && json !== '' && t('不是一个合法的JSON字符串')}&nbsp;
      </div>

      <div className="text-right">
        <Button
          loading={loading}
          disabled={invalid}
          onClick={handleInstallPlugin}
        >
          {t('确认')}
        </Button>
      </div>
    </div>
  );
});
ManualInstall.displayName = 'ManualInstall';
