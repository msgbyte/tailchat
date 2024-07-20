import { useMemo, useState } from 'react';
import { useFriendNicknameMap } from '../redux/hooks/useFriendNickname';
import type { UserBaseInfo } from 'tailchat-types';

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

/**
 * 用于搜索用户的封装函数
 */
export function useUserSearch(userInfos: UserBaseInfo[]) {
  const friendNicknameMap = useFriendNicknameMap();
  const validUserInfos = useMemo(() => userInfos.filter(Boolean), [userInfos]);

  const { searchText, setSearchText, isSearching, searchResult } = useSearch({
    dataSource: validUserInfos,
    filterFn: (item, searchText) => {
      if (friendNicknameMap[item._id]) {
        if (friendNicknameMap[item._id].includes(searchText)) {
          return true;
        }
      }

      if (item.nickname.includes(searchText)) {
        return true;
      }

      return false;
    },
  });

  return {
    searchText,
    setSearchText,
    isSearching,
    searchResult,
  };
}
