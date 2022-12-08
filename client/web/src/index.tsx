import './init';
import './dev';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { initPlugins } from './plugin/loader';
import { installServiceWorker } from './utils/sw-helper';
import { showErrorToasts, t } from 'tailchat-shared';
import { recordMeasure } from './utils/measure-helper';
import './styles';

installServiceWorker();

// 先加载插件再开启应用
recordMeasure('initPluginsStart');
initPlugins()
  .then(() => {
    recordMeasure('initPluginsEnd');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const root = createRoot(document.querySelector('#app')!);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch(() => {
    showErrorToasts(t('MiniStar 应用初始化失败'));
  });
