import type {
  ChatMessage,
  SendMessagePayload,
  SimpleMessagePayload,
} from '../model/message';
import _isNil from 'lodash/isNil';
import _set from 'lodash/set';
import _pick from 'lodash/pick';

const replyMsgFields = ['_id', 'content', 'author'] as const;
export type ReplyMsgType = Pick<ChatMessage, typeof replyMsgFields[number]>;

export class MessageHelper {
  private payload: SendMessagePayload;

  constructor(origin: SimpleMessagePayload) {
    this.payload = { ...origin };
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
