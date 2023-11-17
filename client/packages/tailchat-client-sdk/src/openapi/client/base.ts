import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';

export class TailchatBaseClient {
  request: AxiosInstance;
  jwt: string | null = null;
  userId: string | null = null;
  loginP: Promise<void>;

  constructor(
    public url: string,
    public appId: string,
    public appSecret: string
  ) {
    if (!url || !appId || !appSecret) {
      throw new Error(
        'Require params: apiUrl, appId, appSecret. You can set it with env'
      );
    }

    this.request = axios.create({
      baseURL: url,
    });
    this.request.interceptors.request.use(async (val) => {
      if (
        this.jwt &&
        ['post', 'get'].includes(String(val.method).toLowerCase()) &&
        !val.headers['X-Token']
      ) {
        // 任何请求都尝试增加token
        val.headers['X-Token'] = this.jwt;
      }

      return val;
    });
    this.loginP = this.login();
  }

  async login() {
    try {
      console.log('Login...');
      const { data } = await this.request.post('/api/openapi/bot/login', {
        appId: this.appId,
        token: this.getBotToken(),
      });

      // NOTICE: 注意，有30天过期时间，需要定期重新登录以换取新的token
      // 这里先不换
      this.jwt = data.data?.jwt;

      console.log('tailchat openapp login success!');

      // 尝试调用函数
      // this.whoami().then(console.log);
    } catch (err) {
      console.error(err);
      throw new Error(
        `Login failed, please check application credentials or network(Error: ${String(
          err
        )})`
      );
    }
  }

  async waitingForLogin(): Promise<void> {
    await Promise.resolve(this.loginP);
  }

  async call(action: string, params = {}) {
    try {
      await this.waitingForLogin();
      console.log('Calling:', action);
      const { data } = await this.request.post(
        '/api/' + action.replace(/\./g, '/'),
        params
      );

      return data.data;
    } catch (err: any) {
      console.error('Service Call Failed:', err);
      const data: string = err?.response?.data;
      if (data) {
        throw new Error(
          JSON.stringify({
            action,
            data,
          })
        );
      } else {
        throw err;
      }
    }
  }

  async whoami(): Promise<{
    userAgent: string;
    language: string;
    user: {
      _id: string;
      nickname: string;
      email: string;
      avatar: string;
    };
    token: string;
    userId: string;
  }> {
    return this.call('user.whoami');
  }

  getBotToken() {
    return crypto
      .createHash('md5')
      .update(this.appId + this.appSecret)
      .digest('hex');
  }

  /**
   * Send normal message to tailchat
   */
  async sendMessage(payload: {
    converseId: string;
    groupId?: string;
    content: string;
    plain?: string;
    meta?: object;
  }) {
    return this.call('chat.message.sendMessage', payload);
  }

  /**
   * Reply message
   */
  async replyMessage(
    replyInfo: {
      messageId: string;
      author: string;
      content: string;
    },
    payload: {
      converseId: string;
      groupId?: string;
      content: string;
      plain?: string;
      meta?: object;
    }
  ) {
    return this.sendMessage({
      ...payload,
      meta: {
        ...payload.meta,
        mentions: [replyInfo.author],
        reply: {
          _id: replyInfo.messageId,
          author: replyInfo.author,
          content: replyInfo.content,
        },
      },
      content: `[at=${replyInfo.author}][/at] ${payload.content}`,
    });
  }
}
