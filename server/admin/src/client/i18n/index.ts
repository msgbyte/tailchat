import type { TushanContextProps } from 'tushan';
import { enTranslation } from './en';
import { zhTranslation } from './zh';

export const i18n: TushanContextProps['i18n'] = {
  languages: [
    {
      key: 'en',
      label: 'English',
      translation: enTranslation,
    },
    {
      key: 'zh',
      label: '简体中文',
      translation: zhTranslation,
    },
  ],
};
