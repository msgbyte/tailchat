import { useDataReady, useGlobalConfigStore } from 'tailchat-shared';

export function useInjectTianjiScript() {
  const { tianji } = useGlobalConfigStore();

  useDataReady(
    () =>
      typeof tianji.scriptUrl === 'string' &&
      typeof tianji.websiteId === 'string' &&
      tianji.websiteId.length > 0,
    () => {
      if (!tianji.scriptUrl) {
        console.error(
          'Cannot inject Tianji script because of scriptUrl not cool:',
          tianji.scriptUrl
        );
        return;
      }

      const el = document.createElement('script');
      el.src = tianji.scriptUrl;
      el.setAttribute('data-website-id', String(tianji.websiteId));
      el.setAttribute('async', 'async');
      el.setAttribute('defer', 'defer');
      document.head.append(el);
    }
  );
}
