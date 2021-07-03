import React from 'react';
import { Navbar } from './Navbar';
import { MainProvider } from './Provider';
import { Sidebar } from './Sidebar';

export const MainRoute: React.FC = React.memo(() => {
  return (
    <div className="flex h-full">
      <MainProvider>
        <Navbar />

        <Sidebar />

        <div className="flex-auto bg-gray-700">{/* Main Content */}</div>
      </MainProvider>
    </div>
  );
});
MainRoute.displayName = 'MainRoute';
