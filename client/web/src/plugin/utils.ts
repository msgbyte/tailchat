import { isValidJson, parseUrlStr, PluginManifest, t } from 'tailchat-shared';
import { Validator } from 'jsonschema';

/**
 * 解析json字符串成插件对象
 * 如果格式不合法则会抛出异常
 */
export function parsePluginManifest(json: string): PluginManifest {
  if (!isValidJson(json)) {
    throw new Error(t('不是一个合法的JSON字符串'));
  }

  const obj = JSON.parse(json);
  const { valid, errors } = new Validator().validate(obj, {
    type: 'object',
    properties: {
      label: { type: 'string' },
      name: { type: 'string' },
      url: { type: 'string' },
      icon: { type: 'string' },
      version: { type: 'string' },
      author: { type: 'string' },
      description: { type: 'string' },
      requireRestart: { type: 'boolean' },
    },
    required: ['label', 'name', 'url', 'version', 'author', 'description'],
    additionalProperties: false,
  });

  if (!valid) {
    console.error(
      '[PluginManifest validation]:',
      errors.map((e) => e.message).join(', ')
    );

    throw new Error(t('不是一个合法的插件配置'));
  }

  // 后端url策略。根据前端的url在获取时自动变更为当前链接的后端地址
  obj.url = parseUrlStr(obj.url);

  return obj;
}
