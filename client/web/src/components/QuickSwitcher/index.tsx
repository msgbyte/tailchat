import { stopPropagation } from '@/utils/dom-helper';
import { Input } from 'antd';
import React, { useCallback, useState } from 'react';
import { t } from 'tailchat-shared';
import { PortalAdd, PortalRemove } from '../Portal';
import clsx from 'clsx';
import { useGlobalKeyDown } from '@/hooks/useGlobalKeyDown';
import {
  isArrowDown,
  isArrowUp,
  isEnterHotkey,
  isEscHotkey,
} from '@/utils/hot-key';
import { useQuickSwitcherActionContext } from './useQuickSwitcherActionContext';
import { useQuickSwitcherFilteredActions } from './useQuickSwitcherFilteredActions';

let currentQuickSwitcherKey: number | null = null;

const QuickSwitcher: React.FC = React.memo(() => {
  const [keyword, setKeyword] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const actionContext = useQuickSwitcherActionContext();

  const handleClose = useCallback(() => {
    if (!currentQuickSwitcherKey) {
      return;
    }

    PortalRemove(currentQuickSwitcherKey);
    currentQuickSwitcherKey = null;
  }, []);

  const filteredActions = useQuickSwitcherFilteredActions(keyword);

  useGlobalKeyDown((e) => {
    if (isArrowUp(e)) {
      const newIndex = selectedIndex - 1;
      setSelectedIndex(
        newIndex >= 0 ? newIndex : filteredActions.length + newIndex
      );
    } else if (isArrowDown(e)) {
      setSelectedIndex((selectedIndex + 1) % filteredActions.length);
    }

    if (isEnterHotkey(e)) {
      const selectedAction = filteredActions[selectedIndex];
      typeof selectedAction.action === 'function' &&
        selectedAction.action(actionContext);
      handleClose();
    } else if (isEscHotkey(e)) {
      handleClose();
    }
  });

  return (
    <div
      className="fixed left-0 right-0 top-0 bottom-0 bg-black bg-opacity-60 flex justify-center"
      onClick={handleClose}
    >
      <div
        className="modal-inner bg-content-light dark:bg-content-dark rounded overflow-auto relative p-4"
        style={{
          marginTop: '20vh',
          height: 'fit-content',
          maxHeight: '60vh',
          width: '60vw',
          maxWidth: '1280px',
        }}
        onClick={stopPropagation}
      >
        <Input
          className="mb-1"
          autoFocus={true}
          placeholder={t('快速搜索、跳转')}
          size="large"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        {filteredActions.map((action, i) => (
          <div
            key={action.key}
            className={clsx(
              'truncate px-2 py-1 rounded cursor-pointer mb-0.5 group transition-all',
              'hover:bg-black hover:bg-opacity-20 dark:hover:bg-white dark:hover:bg-opacity-20',
              {
                'bg-black bg-opacity-20 dark:bg-white dark:bg-opacity-20':
                  selectedIndex === i,
              }
            )}
            onClick={() => {
              action.action(actionContext);
              handleClose();
            }}
          >
            <div className="text-lg">{action.label}</div>
            <div
              className={clsx(
                'opacity-0 text-gray-400 text-xs group-hover:opacity-100 transition-all',
                {
                  'opacity-100': selectedIndex === i,
                }
              )}
            >
              {action.source}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
QuickSwitcher.displayName = 'QuickSwitcher';

/**
 * 打开快速开关
 */
export function openQuickSwitcher() {
  if (typeof currentQuickSwitcherKey === 'number') {
    return;
  }

  currentQuickSwitcherKey = PortalAdd(<QuickSwitcher />);
}
