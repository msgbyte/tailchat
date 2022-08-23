import './init';
import './dev';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { initPlugins } from './plugin/loader';
import { installServiceWorker } from './utils/sw-helper';
import { showErrorToasts, t } from 'tailchat-shared';
import './styles';

installServiceWorker();

// 先加载插件再开启应用
initPlugins()
  .then(() => {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.querySelector('#app')
    );
  })
  .catch(() => {
    showErrorToasts(t('MiniStar 应用初始化失败'));
  });
