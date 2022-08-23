import { decode, encode, isMiao } from './miaotrans';
import { regMessageInterpreter } from '@capital/common';
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
