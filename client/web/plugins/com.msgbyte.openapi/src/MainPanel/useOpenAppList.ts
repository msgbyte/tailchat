import {
  postRequest,
  appendUrlSearch,
  useAsyncRefresh,
  useLocation,
  urlSearchParse,
  isValidStr,
  useNavigate,
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
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    // 仅初始化的时候才处理
    const { appId } = urlSearchParse(location.search, {
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
    handleSetSelectedApp(appId: string | null) {
      navigate({
        search: appendUrlSearch({
          appId,
        }),
      });
      setSelectedAppId(appId);
    },
  };
}
