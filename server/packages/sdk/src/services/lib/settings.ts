import dotenv from 'dotenv';
import _ from 'lodash';

dotenv.config();

/**
 * 配置信息
 */
const port = process.env.PORT ? Number(process.env.PORT) : 11000;
const apiUrl = process.env.API_URL || `http://127.0.0.1:${port}`;
export const config = {
  port,
  secret: process.env.SECRET || 'tailchat',
  env: process.env.NODE_ENV || 'development',
  /**
   * 是否打开socket admin ui
   */
  enableSocketAdmin: !!process.env.ADMIN,
  redisUrl: process.env.REDIS_URL,
  mongoUrl: process.env.MONGO_URL,
  storage: {
    type: 'minio', // 可选: minio
    minioUrl: process.env.MINIO_URL,
    user: process.env.MINIO_USER,
    pass: process.env.MINIO_PASS,
    bucketName: process.env.MINIO_BUCKET_NAME || 'tailchat',

    /**
     * 文件上传限制
     * 单位byte
     * 默认 1m
     */
    limit: process.env.FILE_LIMIT
      ? Number(process.env.FILE_LIMIT)
      : 1 * 1024 * 1024,
  },
  apiUrl,
  staticUrl: `${apiUrl}/static/`,
  enableOpenapi: true, // 是否开始openapi
  smtp: {
    senderName: process.env.SMTP_SENDER, // 发邮件者显示名称
    connectionUrl: process.env.SMTP_URI || '',
  },
  enablePrometheus: checkEnvTrusty(process.env.PROMETHEUS),
  feature: {
    disableFileCheck: checkEnvTrusty(process.env.DISABLE_FILE_CHECK),
  },
};

export const builtinAuthWhitelist = [
  '/gateway/health',
  '/debug/hello',
  '/user/login',
  '/user/register',
  '/user/createTemporaryUser',
  '/user/resolveToken',
  '/user/getUserInfo',
  '/group/getGroupBasicInfo',
  '/group/invite/findInviteByCode',
];

/**
 * 构建上传地址
 */
export function buildUploadUrl(objectName: string) {
  return config.staticUrl + objectName;
}

/**
 * 判断环境变量是否为true
 */
export function checkEnvTrusty(env: string): boolean {
  return env === '1' || env === 'true';
}
