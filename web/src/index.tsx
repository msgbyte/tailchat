import './init';
import './dev';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

import 'antd/dist/antd.css';
import './styles/antd/index.less';
import 'tailwindcss/tailwind.css';
import './styles/global.less';

ReactDOM.render(<App />, document.querySelector('#app'));
