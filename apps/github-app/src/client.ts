import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';

export class TailchatClient {
  request: AxiosInstance;
  jwt: string | null = null;

  constructor(
    public url: string,
    public appId: string,
    public appSecret: string
  ) {
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
    this.login();
  }

  async login() {
    try {
      const { data } = await this.request.post('/api/openapi/bot/login', {
        appId: this.appId,
        token: this.getBotToken(),
      });

      // NOTICE: 注意，有30天过期时间，需要定期重新登录以换取新的token
      // 这里先不换
      this.jwt = data.data?.jwt;

      console.log('tailchat openapp login success!');

      // 尝试调用函数
      console.log(await this.whoami());
    } catch (err) {
      console.error(err);
      throw new Error();
    }
  }

  async call(action: string, params = {}) {
    const { data } = await this.request.post(
      '/api/' + action.replace(/\./g, '/'),
      params
    );

    return data;
  }

  async whoami() {
    return this.call('user.whoami');
  }

  getBotToken() {
    return crypto
      .createHash('md5')
      .update(this.appId + this.appSecret)
      .digest('hex');
  }
}
