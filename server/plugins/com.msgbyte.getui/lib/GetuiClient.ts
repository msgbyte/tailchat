import got from 'got';
import crypto from 'crypto';
import _ from 'lodash';

function sha256(data: string) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

interface AuthResPayload {
  msg: string;
  code: number;
  data: {
    expire_time: string;
    token: string;
  };
}

interface SinglePushResPayload {
  msg: string;
  code: number;
  data: {
    [taskid: string]: {
      [cid: string]:
        | 'successed_offline'
        | 'successed_online'
        | 'successed_ignore';
    };
  };
}

interface AllPushResPayload {
  msg: string;
  code: number;
  data: {
    [taskid: string]: string;
  };
}

export class GetuiClient {
  token: string;
  expireTime: number;

  constructor(
    public appId: string,
    public appkey: string,
    public mastersecret: string
  ) {}

  get baseUrl() {
    return `https://restapi.getui.com/v2/${this.appId}`;
  }

  /**
   * Generate Request ID with fixed prefix and timestamp and random number
   */
  generateRequestId(): string {
    return (
      'tailchat' +
      String(Date.now()) +
      _.padStart(String(Math.floor(Math.random() * 1e8)), 8, '0')
    );
  }

  signBody() {
    const timestamp = String(Date.now());

    return {
      sign: sha256(this.appkey + String(Date.now()) + this.mastersecret),
      timestamp,
      appkey: this.appkey,
    };
  }

  private async fetchToken() {
    try {
      const res = await got(`${this.baseUrl}/auth`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=utf-8',
        },
        json: {
          ...this.signBody(),
        },
      }).json<AuthResPayload>();

      if (res.code === 0) {
        this.token = res.data.token;
        this.expireTime = Number(res.data.expire_time) - 60 * 1000; // 提前60s过期
      }
    } catch (err) {
      console.error(err);
    }
  }

  async getToken(): Promise<string> {
    if (!this.token || Date.now() > this.expireTime) {
      // 如果token不存在或者token过期
      await this.fetchToken();
    }

    return this.token;
  }

  async singlePush(
    userId: string,
    title: string,
    body: string,
    payload: {}
  ): Promise<SinglePushResPayload> {
    const token = await this.getToken();
    const requestId = this.generateRequestId();
    const res = await got(`${this.baseUrl}/push/single/alias`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=utf-8',
        token,
      },
      json: {
        request_id: requestId,
        audience: {
          alias: [userId],
        },
        push_message: {
          notification: {
            title: title,
            body: body,
            click_type: 'payload',
            payload: JSON.stringify(payload),
          },
        },
      },
    }).json<SinglePushResPayload>();

    return res;
  }

  async allPush(
    title: string,
    body: string,
    payload: {}
  ): Promise<AllPushResPayload> {
    const token = await this.getToken();
    console.log('token', token);
    const requestId = this.generateRequestId();
    const res = await got(`${this.baseUrl}/push/all`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=utf-8',
        token,
      },
      json: {
        request_id: requestId,
        audience: 'all',
        push_message: {
          notification: {
            title: title,
            body: body,
            click_type: 'payload',
            payload: JSON.stringify(payload),
          },
        },
      },
    }).json<AllPushResPayload>();

    return res;
  }
}
