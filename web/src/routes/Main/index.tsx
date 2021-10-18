import { useRecordMeasure } from '@/utils/measure-helper';
import React from 'react';
import { MainContent } from './Content';
import { Navbar } from './Navbar';
import { MainProvider } from './Provider';
import { useShortcuts } from './useShortcuts';

const MainRoute: React.FC = React.memo(() => {
  useRecordMeasure('AppMainRenderStart');
  useShortcuts();

  return (
    <div className="flex h-full">
      <MainProvider>
        <Navbar />

        <MainContent />
      </MainProvider>
    </div>
  );
});
MainRoute.displayName = 'MainRoute';

export default MainRoute;
