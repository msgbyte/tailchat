import './init';
import './dev';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { initPlugins } from './plugin/loader';
import './styles';
import { installServiceWorker } from './utils/sw-helper';

installServiceWorker();

// 先加载插件再开启应用
initPlugins().then(() => {
  ReactDOM.render(<App />, document.querySelector('#app'));
});
