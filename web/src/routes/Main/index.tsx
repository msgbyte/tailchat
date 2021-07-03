import React from 'react';
import { Content } from './Content';
import { Navbar } from './Navbar';
import { MainProvider } from './Provider';
import { Sidebar } from './Sidebar';

export const MainRoute: React.FC = React.memo(() => {
  return (
    <div className="flex h-full">
      <MainProvider>
        <Navbar />

        <Sidebar />

        <Content />
      </MainProvider>
    </div>
  );
});
MainRoute.displayName = 'MainRoute';
