import React from 'react';

const Icon: React.FC = React.memo(() => {
  return (
    <div className="w-10 h-10 hover:rounded-sm bg-gray-300 mb-2 transition-all rounded-1/2 cursor-pointer"></div>
  );
});

export const App: React.FC = React.memo(() => {
  return (
    <div className="flex h-screen w-screen">
      <div className="w-16 bg-gray-900 flex flex-col justify-start items-center pt-4 pb-4 p-1">
        <Icon />
        <div className="h-px w-full bg-white mt-4 mb-4"></div>
        <Icon />
        <Icon />
        <Icon />
        <Icon />
      </div>
      <div className="w-56 bg-gray-800"></div>
      <div className="flex-auto bg-gray-700"></div>
    </div>
  );
});
