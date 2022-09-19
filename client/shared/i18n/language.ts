import type { LanguageDetectorAsyncModule } from 'i18next';
import { useRef, useMemo, useCallback } from 'react';
import _isNil from 'lodash/isNil';
import { AllowedLanguage, setLanguage as setI18NLanguage } from './index';
import { getStorage, useStorage } from '../manager/storage';
import { LANGUAGE_KEY } from '../utils/consts';

const defaultLanguage = 'zh-CN';

/**
 * 获取当前语言
 */
async function getLanguage(): Promise<string> {
  return await getStorage().get(LANGUAGE_KEY, defaultLanguage);
}

/**
 * 当前语言管理hook
 */
export function useLanguage() {
  const [language, { save }] = useStorage<AllowedLanguage>(
    LANGUAGE_KEY,
    defaultLanguage
  );

  const originLanguageRef = useRef<string>();

  const setLanguage = useCallback(
    async (newLanguage: AllowedLanguage) => {
      if (_isNil(originLanguageRef.current)) {
        originLanguageRef.current = language;
      }

      save(newLanguage);
      await setI18NLanguage(newLanguage);
    },
    [language, save]
  );

  const isChanged = useMemo(() => {
    if (_isNil(originLanguageRef.current)) {
      return false;
    }

    return originLanguageRef.current !== language;
  }, [language]);

  return { language, setLanguage, isChanged };
}

/**
 * 存储语言
 * @param lang 语言代码
 */
export async function saveLanguage(lang: string) {
  await getStorage().save(LANGUAGE_KEY, lang);
}

/**
 * i18n语言检测中间件
 */
export const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async (callback) => {
    try {
      const language = await getLanguage();
      callback(language);
    } catch (error) {
      callback(defaultLanguage);
    }
  },
  cacheUserLanguage(language) {
    try {
      saveLanguage(language);
    } catch (error) {}
  },
};
