import React from 'react';
import { CommonSidebarWrapper } from '@/components/CommonSidebarWrapper';
import { t } from 'tailchat-shared';

/**
 * 收件箱侧边栏组件
 */
export const InboxSidebar: React.FC = React.memo(() => {
  return (
    <CommonSidebarWrapper data-tc-role="sidebar-inbox">
      <div className="overflow-auto">
        {Array.from({ length: 20 }).map((_, i) => {
          return (
            <div
              key={i}
              className="p-2 overflow-auto cursor-pointer hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10"
            >
              <div className="text-lg">Title {i}</div>
              <div className="break-all text-opacity-80 text-black dark:text-opacity-80 dark:text-white text-sm p-1 border-l-2 border-gray-500 border-opacity-50">
                DescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDescDesc
              </div>
              <div className="text-xs text-opacity-50 text-black dark:text-opacity-50 dark:text-white">
                {t('来自')}: Tailchat
              </div>
            </div>
          );
        })}
      </div>
    </CommonSidebarWrapper>
  );
});
InboxSidebar.displayName = 'InboxSidebar';
