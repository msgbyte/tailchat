import './init';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

import 'antd/dist/antd.css';
import './styles/antd.less';
import 'tailwindcss/tailwind.css';

ReactDOM.render(<App />, document.querySelector('#app'));
