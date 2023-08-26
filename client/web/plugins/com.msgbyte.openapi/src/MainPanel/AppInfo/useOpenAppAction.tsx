import {
  openReconfirmModal,
  postRequest,
  showErrorToasts,
  useAsyncFn,
  useEvent,
} from '@capital/common';
import { useOpenAppInfo } from '../context';
import type { OpenAppBot, OpenAppCapability, OpenAppOAuth } from '../types';

/**
 * 开放应用操作
 */
export function useOpenAppAction() {
  const { refresh, appId, capability, onSelectApp } = useOpenAppInfo();

  const [{ loading }, handleChangeAppCapability] = useAsyncFn(
    async (targetCapability: OpenAppCapability, checked: boolean) => {
      const newCapability: OpenAppCapability[] = [...capability];
      const findIndex = newCapability.findIndex((c) => c === targetCapability);

      if (checked) {
        if (findIndex === -1) {
          newCapability.push(targetCapability);
        }
      } else {
        if (findIndex !== -1) {
          newCapability.splice(findIndex, 1);
        }
      }

      await postRequest('/openapi/app/setAppCapability', {
        appId,
        capability: newCapability,
      });
      await refresh();
    },
    [appId, capability, refresh]
  );

  const [, handleUpdateOAuthInfo] = useAsyncFn(
    async <T extends keyof OpenAppOAuth>(name: T, value: OpenAppOAuth[T]) => {
      await postRequest('/openapi/app/setAppOAuthInfo', {
        appId,
        fieldName: name,
        fieldValue: value,
      });
      await refresh();
    },
    []
  );

  const [, handleUpdateBotInfo] = useAsyncFn(
    async <T extends keyof OpenAppBot>(name: T, value: OpenAppBot[T]) => {
      await postRequest('/openapi/app/setAppBotInfo', {
        appId,
        fieldName: name,
        fieldValue: value,
      });
      await refresh();
    },
    [appId, refresh]
  );

  const handleDeleteApp = useEvent(() => {
    openReconfirmModal({
      onConfirm: async () => {
        try {
          await postRequest('/openapi/app/delete', {
            appId,
          });
          onSelectApp(null);
          await refresh();
        } catch (err) {
          showErrorToasts(err);
        }
      },
    });
  });

  return {
    loading,
    handleDeleteApp,
    handleChangeAppCapability,
    handleUpdateOAuthInfo,
    handleUpdateBotInfo,
  };
}
