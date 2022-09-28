import React from 'react';
import { Personal } from './Personal';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Group } from './Group';
import { Inbox } from './Inbox';

export const MainContent: React.FC = React.memo(() => {
  return (
    <Routes>
      <Route path="/personal/*" element={<Personal />} />
      <Route path="/inbox/*" element={<Inbox />} />
      <Route path="/group/:groupId/*" element={<Group />} />
      <Route
        path="/"
        element={<Navigate to="/main/personal" replace={true} />}
      />
    </Routes>
  );
});
MainContent.displayName = 'MainContent';
