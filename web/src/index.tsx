import './init';
import './dev';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { initMiniStar } from 'mini-star';

import 'antd/dist/antd.css';
import './styles/antd/index.less';
import 'tailwindcss/tailwind.css';
import './styles/global.less';

// 先加载插件再开启应用
initMiniStar({
  plugins: [
    {
      name: 'com.msgbyte.webpanel',
      url: '/plugins/com.msgbyte.webpanel/index.js',
    },
  ],
}).then(() => {
  ReactDOM.render(<App />, document.querySelector('#app'));
});
