import { pluginCustomPanel } from '@/plugin/common';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PageContent } from '../PageContent';
import { PersonalConverse } from './Converse';
import { FriendPanel } from './Friends';
import { PluginsPanel } from './Plugins';
import { PersonalSidebar } from './Sidebar';

export const Personal: React.FC = React.memo(() => {
  return (
    <PageContent data-tc-role="content-personal" sidebar={<PersonalSidebar />}>
      <Routes>
        <Route path="/friends" element={<FriendPanel />} />
        <Route path="/plugins" element={<PluginsPanel />} />
        <Route path="/converse/:converseId" element={<PersonalConverse />} />
        {pluginCustomPanel
          .filter((p) => p.position === 'personal')
          .map((p) => (
            <Route
              key={p.name}
              path={`/custom/${p.name}`}
              element={React.createElement(p.render)}
            />
          ))}

        <Route path="/" element={<Navigate to="/main/personal/friends" />} />
      </Routes>
    </PageContent>
  );
});
Personal.displayName = 'Personal';
