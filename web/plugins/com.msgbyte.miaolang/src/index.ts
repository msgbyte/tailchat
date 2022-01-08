import { decode, encode, isMiao } from './miaotrans';
import {
  regMessageInterpreter,
  regChatInputAction,
  openModal,
} from '@capital/common';
import { createElement } from 'react';
import { SendMiaoModal } from './SendMiaoModal';
import { Translate } from './translate';

const miao = encode('喵语翻译已加载');
const human = decode(miao);

console.log(`${miao}\n${human}`);

regMessageInterpreter({
  name: Translate.miaoTrans,
  explainMessage(message: string) {
    // 喵语 -> 人话
    if (!isMiao(message)) {
      return null;
    }

    return decode(message);
  },
});

regChatInputAction({
  label: Translate.title,
  onClick: (actions) => {
    openModal(createElement(SendMiaoModal, { actions }));
  },
});
