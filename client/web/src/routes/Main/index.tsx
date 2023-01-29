import { GlobalTemporaryTip } from '@/components/GlobalTemporaryTip';
import { useRecordMeasure } from '@/utils/measure-helper';
import React from 'react';
import { useMessageNotifyEventFilter } from 'tailchat-shared';
import { MainContent } from './Content';
import { Navbar } from './Navbar';
import { MainProvider } from './Provider';
import { useShortcuts } from './useShortcuts';

const MainRoute: React.FC = React.memo(() => {
  useRecordMeasure('appMainRenderStart');
  useShortcuts();
  useMessageNotifyEventFilter();

  return (
    <MainProvider>
      <div className="flex flex-col h-full">
        <GlobalTemporaryTip />

        <div className="flex flex-1 overflow-hidden">
          <Navbar />

          <MainContent />
        </div>
      </div>
    </MainProvider>
  );
});
MainRoute.displayName = 'MainRoute';

export default MainRoute;
