import { decode, encode, isMiao } from './trans';
import {
  regMessageInterpreter,
  regChatInputAction,
  openModal,
} from '@capital/common';
import { createElement } from 'react';
import { SendMiaoModal } from './SendMiaoModal';

const miao = encode('喵语翻译已加载');
const human = decode(miao);

console.log(`${miao}\n${human}`);

regMessageInterpreter({
  name: '喵语翻译',
  explainMessage(message: string) {
    // 喵语 -> 人话
    if (!isMiao(message)) {
      return null;
    }

    return decode(message);
  },
});

regChatInputAction({
  label: '喵言喵语',
  onClick: (actions) => {
    openModal(createElement(SendMiaoModal, { actions }));
  },
});
