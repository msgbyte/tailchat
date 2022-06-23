import { useMemo, useState } from 'react';

export interface UseSearchOptions<T> {
  dataSource: T[];
  filterFn: (item: T, searchText: string) => boolean;
}

export function useSearch<T>(options: UseSearchOptions<T>) {
  const { dataSource, filterFn } = options;
  const [searchText, setSearchText] = useState('');
  const isSearching = searchText !== '';

  const searchResult = useMemo(() => {
    return dataSource.filter((item) => filterFn(item, searchText));
  }, [dataSource, searchText]);

  return {
    searchText,
    setSearchText,
    isSearching,
    searchResult,
  };
}
