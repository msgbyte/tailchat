import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';

export class TailchatClient {
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
      console.log('正在登录...');
      const { data } = await this.request.post('/api/openapi/bot/login', {
        appId: this.appId,
        token: this.getBotToken(),
      });

      // NOTICE: 注意，有30天过期时间，需要定期重新登录以换取新的token
      // 这里先不换
      this.jwt = data.data?.jwt;

      console.log('tailchat openapp login success!');

      // 尝试调用函数
      this.whoami().then(console.log);
    } catch (err) {
      console.error(err);
      throw new Error('登录失败, 请检查应用凭证');
    }
  }

  async call(action: string, params = {}) {
    try {
      await Promise.resolve(this.loginP);
      console.log('正在调用服务:', action);
      const { data } = await this.request.post(
        '/api/' + action.replace(/\./g, '/'),
        params
      );

      return data;
    } catch (err: any) {
      console.error('服务调用失败:', err);
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
