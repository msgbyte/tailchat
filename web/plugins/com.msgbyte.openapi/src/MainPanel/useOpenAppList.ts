import {
  postRequest,
  appendUrlSearch,
  useAsyncRefresh,
  useHistory,
  urlSearchParse,
  isValidStr,
} from '@capital/common';
import { useEffect, useState } from 'react';
import { OpenApp } from './types';

/**
 * 开放应用列表
 */
export function useOpenAppList() {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const {
    loading,
    value: allApps = [],
    refresh,
  } = useAsyncRefresh(async (): Promise<OpenApp[]> => {
    const { data } = await postRequest('/openapi/app/all');

    return data ?? [];
  }, []);

  const history = useHistory();

  useEffect(() => {
    // 仅初始化的时候才处理
    const { appId } = urlSearchParse(history.location.search, {
      ignoreQueryPrefix: true,
    });

    if (isValidStr(appId)) {
      setSelectedAppId(appId);
    }
  }, []);

  return {
    loading,
    allApps,
    refresh,
    appInfo: allApps.find((a) => a._id === selectedAppId),
    /**
     * 设置当前选中的开放app
     */
    handleSetSelectedApp(appId: string) {
      history.push({
        ...history.location,
        search: appendUrlSearch({
          appId,
        }),
      });
      setSelectedAppId(appId);
    },
  };
}
