export const t = (key: string) => {
  return key;
};

export function onLanguageChanged() {}

export function useTranslation() {
  return { t };
}
