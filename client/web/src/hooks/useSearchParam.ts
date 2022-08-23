import { getSearchParam } from '@/utils/location-helper';
import { useEffect, useState } from 'react';

export type UseQueryParam = (param: string) => string | null;

export const useSearchParam: UseQueryParam = (param) => {
  const [value, setValue] = useState<string | null>(() =>
    getSearchParam(param)
  );

  useEffect(() => {
    const onChange = () => {
      setValue(getSearchParam(param));
    };

    window.addEventListener('popstate', onChange);
    window.addEventListener('pushstate', onChange);
    window.addEventListener('replacestate', onChange);

    return () => {
      window.removeEventListener('popstate', onChange);
      window.removeEventListener('pushstate', onChange);
      window.removeEventListener('replacestate', onChange);
    };
  }, []);

  return value;
};
