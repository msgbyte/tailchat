import { useRecordMeasure } from '@/utils/measure-helper';
import React from 'react';
import { Route, Routes } from 'react-router';
import { MainProvider } from '../Main/Provider';
import { t } from 'tailchat-shared';
import { PersonalConverse } from '../Main/Content/Personal/Converse';
import { GroupPanelRoute } from '../Main/Content/Group/Panel';
import { GroupDetail } from '@/components/modals/GroupDetail';
import { useParams } from 'react-router';
import { NotFound } from '@/components/NotFound';
import { Group } from '../Main/Content/Group';

const GroupDetailRoute = React.memo(() => {
  const { groupId } = useParams<{ groupId: string }>();

  if (!groupId) {
    return <NotFound />;
  }

  return <GroupDetail groupId={groupId} onClose={() => {}} />;
});
GroupDetailRoute.displayName = 'GroupDetailRoute';

const PanelRoute: React.FC = React.memo(() => {
  useRecordMeasure('appRouteRenderStart');

  return (
    <div className="flex h-full bg-content-light dark:bg-content-dark">
      <MainProvider>
        <Routes>
          <Route
            path="/personal/converse/:converseId"
            element={<PersonalConverse />}
          />
          <Route path="/group/:groupId/detail" element={<GroupDetailRoute />} />
          <Route
            path="/group/:groupId/:panelId"
            element={<GroupPanelRoute />}
          />
          <Route path="/group/main/:groupId/*" element={<Group />} />

          <Route path="/*" element={t('未知的面板')} />
        </Routes>
      </MainProvider>
    </div>
  );
});
PanelRoute.displayName = 'PanelRoute';

export default PanelRoute;
