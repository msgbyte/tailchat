import { openQuickSwitcher } from '@/components/QuickSwitcher';
import { useGlobalKeyDown } from '@/hooks/useGlobalKeyDown';
import { isQuickSwitcher } from '@/utils/hot-key';

/**
 * 全局快捷键
 */
export function useShortcuts() {
  useGlobalKeyDown((e) => {
    if (isQuickSwitcher(e)) {
      // 显示快速跳转开关
      e.preventDefault();
      openQuickSwitcher();
    }
  });
}
