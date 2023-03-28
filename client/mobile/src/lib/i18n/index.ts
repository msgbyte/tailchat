import * as RNLocalize from 'react-native-localize';
import { createIntl, createIntlCache } from '@formatjs/intl';
import { I18nManager } from 'react-native';

const translations = {
  en: require('./translations/en.json'),
  zh: require('./translations/zh.json'),
} as const;

type Translation = keyof typeof translations;

const fallback = { languageTag: 'en', isRTL: false };

const { languageTag, isRTL } =
  RNLocalize.findBestAvailableLanguage(Object.keys(translations)) ?? fallback;

I18nManager.forceRTL(isRTL);

const intl = createIntl(
  {
    defaultLocale: 'en',
    locale: languageTag,
    messages: translations[languageTag as Translation],
  },
  createIntlCache()
);

type TranslationParams = Parameters<(typeof intl)['formatMessage']>[1];

export const translate = (key: string, params?: TranslationParams) =>
  intl
    .formatMessage({ id: key, defaultMessage: translations.en[key] }, params)
    .toString();
