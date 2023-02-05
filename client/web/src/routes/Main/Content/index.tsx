import React from 'react';
import { Personal } from './Personal';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Group } from './Group';
import { Inbox } from './Inbox';
import { pluginCustomPanel } from '@/plugin/common';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const MainContent: React.FC = React.memo(() => {
  return (
    <Routes>
      <Route path="/personal/*" element={<Personal />} />
      <Route path="/inbox/*" element={<Inbox />} />
      <Route path="/group/:groupId/*" element={<Group />} />

      {pluginCustomPanel
        .filter((p) =>
          ['navbar-more', 'navbar-group', 'navbar-personal'].includes(
            p.position
          )
        )
        .map((p) => (
          <Route
            key={p.name}
            path={`/custom/${p.name}`}
            element={
              <ErrorBoundary>{React.createElement(p.render)}</ErrorBoundary>
            }
          />
        ))}

      <Route
        path="/"
        element={<Navigate to="/main/personal" replace={true} />}
      />
    </Routes>
  );
});
MainContent.displayName = 'MainContent';
