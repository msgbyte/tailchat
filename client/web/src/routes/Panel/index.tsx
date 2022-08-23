import { useRecordMeasure } from '@/utils/measure-helper';
import React from 'react';
import { Route, Switch } from 'react-router';
import { MainProvider } from '../Main/Provider';
import { t } from 'tailchat-shared';
import { PersonalConverse } from '../Main/Content/Personal/Converse';
import { GroupPanelRoute } from '../Main/Content/Group/Panel';
import { GroupDetail } from '@/components/modals/GroupDetail';

const PanelRoute: React.FC = React.memo(() => {
  useRecordMeasure('AppRouteRenderStart');

  return (
    <div className="flex h-full bg-content-light dark:bg-content-dark">
      <MainProvider>
        <Switch>
          <Route
            exact={true}
            path="/panel/personal/converse/:converseId"
            component={PersonalConverse}
          />
          <Route
            exact={true}
            path="/panel/group/:groupId/detail"
            render={(props) => (
              <GroupDetail
                groupId={props.match.params.groupId}
                onClose={() => {}}
              />
            )}
          />
          <Route
            exact={true}
            path="/panel/group/:groupId/:panelId"
            component={GroupPanelRoute}
          />

          <Route>{t('未知的面板')}</Route>
        </Switch>
      </MainProvider>
    </div>
  );
});
PanelRoute.displayName = 'PanelRoute';

export default PanelRoute;
