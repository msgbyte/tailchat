import axios, { AxiosInstance } from 'axios';

/**
 * 用于 Tailchat OAuth 信息集成的实例
 */
export class OAuthClient {
  request: AxiosInstance;

  constructor(
    apiUrl: string,
    private appId: string,
    private appSecret: string
  ) {
    this.request = axios.create({
      baseURL: apiUrl,
      transformRequest: [
        function (data) {
          let ret = '';
          for (const it in data) {
            ret +=
              encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
          }
          ret = ret.substring(0, ret.lastIndexOf('&'));
          return ret;
        },
      ],
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
  }

  /**
   * 根据获取到的code获取授权码
   * @param code 从重定向获取到的临时code
   * @param redirectUrl 重定向的地址
   */
  async getToken(
    code: string,
    redirectUrl: string
  ): Promise<{
    access_token: string;
    expires_in: string;
    id_token: string;
    scope: string;
    token_type: string;
  }> {
    const { data: tokenInfo } = await this.request.post('/open/token', {
      client_id: this.appId,
      client_secret: this.appSecret,
      redirect_uri: redirectUrl,
      code,
      grant_type: 'authorization_code',
    });

    return tokenInfo;
  }

  async getUserInfo(accessToken: string): Promise<any> {
    const { data: userInfo } = await this.request.post('/open/me', {
      access_token: accessToken,
    });

    return userInfo;
  }
}
