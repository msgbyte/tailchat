import React from 'react';
import { Navbar } from './Navbar';
import { MainProvider } from './Provider';

export const MainRoute: React.FC = React.memo(() => {
  return (
    <div className="flex h-full">
      <MainProvider>
        <Navbar />

        <div className="w-56 bg-gray-800 p-2">
          {/* Sidebar */}
          <div className="w-full hover:bg-white hover:bg-opacity-20 cursor-pointer text-white rounded p-2">
            目标
          </div>
        </div>
        <div className="flex-auto bg-gray-700">{/* Main Content */}</div>
      </MainProvider>
    </div>
  );
});
MainRoute.displayName = 'MainRoute';
