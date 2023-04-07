import {
  isValidJson,
  parseUrlStr,
  PluginManifest,
  t,
  getLanguage,
} from 'tailchat-shared';
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
    additionalProperties: true,
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

/**
 * Get manifest field with i18n support,
 * for example: get `label.zh-CN` than `label` in zh-CN language.
 * @param info Plugin Manifest Info
 * @param field Plugin Manifest Field
 */
export function getManifestFieldWithI18N(
  info: PluginManifest,
  field: 'label' | 'description'
): string {
  const language = getLanguage();

  return (info as any)[`${field}.${language}`] ?? info[field];
}
