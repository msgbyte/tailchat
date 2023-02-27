import acceptLanguage from 'accept-language';

type AllowedLanguage = 'en-US' | 'zh-CN';
acceptLanguage.languages(['en-US', 'zh-CN', 'zh', 'zh-TW']);

/**
 * 解析请求头的 Accept-Language
 */
export function parseLanguageFromHead(
  headerLanguage = 'en-US'
): AllowedLanguage {
  const language = acceptLanguage.get(headerLanguage);

  if (language === 'zh' || language === 'zh-TW') {
    return 'zh-CN';
  }

  return language as AllowedLanguage;
}
