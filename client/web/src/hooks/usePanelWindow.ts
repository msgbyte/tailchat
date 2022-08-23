import { panelWindowManager } from '@/utils/window-helper';
import { useCallback } from 'react';
import { uiActions, useAppDispatch, useAppSelector } from 'tailchat-shared';

/**
 * 面板窗口上下文信息
 * 使用hooks来将 redux 数据与 panelWindowManager 数据联合
 */
export function usePanelWindow(panelUrl: string) {
  const hasOpenedPanel = useAppSelector(
    (state) =>
      /**
       * 两处维护地址均存在才视为在控制下
       */
      state.ui.panelWinUrls.includes(panelUrl) &&
      panelWindowManager.has(panelUrl)
  );
  const dispatch = useAppDispatch();

  const openPanelWindow = useCallback(() => {
    panelWindowManager.open(panelUrl, {
      onClose() {
        dispatch(uiActions.deletePanelWindowUrl({ url: panelUrl }));
      },
    });
    dispatch(uiActions.addPanelWindowUrl({ url: panelUrl }));
  }, [panelUrl]);

  const closePanelWindow = useCallback(() => {
    panelWindowManager.close(panelUrl);
    dispatch(uiActions.deletePanelWindowUrl({ url: panelUrl }));
  }, [panelUrl]);

  return {
    hasOpenedPanel,
    openPanelWindow,
    closePanelWindow,
  };
}
