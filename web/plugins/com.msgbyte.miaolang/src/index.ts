import { decode, encode, isMiao } from './trans';
import { regMessageInterpreter } from '@capital/common';

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
