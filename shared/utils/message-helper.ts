import type {
  ChatMessage,
  SendMessagePayload,
  SimpleMessagePayload,
} from '../model/message';
import _isNil from 'lodash/isNil';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _pick from 'lodash/pick';

const replyMsgFields = ['_id', 'content', 'author'] as const;
export type ReplyMsgType = Pick<ChatMessage, typeof replyMsgFields[number]>;

export class MessageHelper {
  private payload: SendMessagePayload;

  constructor(origin: SimpleMessagePayload) {
    this.payload = { ...origin };
  }

  /**
   * 判断消息体内是否有回复信息
   */
  hasReply(): ReplyMsgType | false {
    const reply = _get(this.payload, ['meta', 'reply']);
    if (_isNil(reply)) {
      return false;
    }

    return reply;
  }

  setReplyMsg(replyMsg: ReplyMsgType) {
    if (_isNil(replyMsg)) {
      return;
    }

    _set(this.payload, ['meta', 'reply'], _pick(replyMsg, replyMsgFields));
  }

  /**
   * 生成待发送的消息体
   */
  generatePayload(): SendMessagePayload {
    return { ...this.payload };
  }
}
