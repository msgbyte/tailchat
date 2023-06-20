import type { TranslationMessages } from 'react-admin';
import _merge from 'lodash/merge';
import defaultEnglishMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { chineseResources, englishResources } from './resources';
import { chineseCustom, englishCustom } from './custom';
import { defaultChineseMessages } from './builtin';

const chineseMessages: TranslationMessages = _merge(
  {},
  defaultEnglishMessages,
  defaultChineseMessages,
  chineseResources,
  chineseCustom
);

const englishMessages = _merge(
  {},
  defaultEnglishMessages,
  englishResources,
  englishCustom
);

export const i18nProvider = polyglotI18nProvider(
  (locale: string) => {
    if (locale === 'ch') {
      return chineseMessages;
    } else {
      return englishMessages;
    }
  },
  'en',
  [
    { locale: 'en', name: 'English' },
    { locale: 'ch', name: '简体中文' },
  ]
);
