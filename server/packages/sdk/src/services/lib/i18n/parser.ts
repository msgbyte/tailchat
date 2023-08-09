import acceptLanguage from 'accept-language';

type AllowedLanguage = 'en-US' | 'zh-CN';
acceptLanguage.languages(['en', 'en-US', 'zh-CN', 'zh', 'zh-TW']);

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

  if (language === 'en' || language === 'en-US') {
    return 'en-US';
  }

  return language as AllowedLanguage;
}
