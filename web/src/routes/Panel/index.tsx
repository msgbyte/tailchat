import { useRecordMeasure } from '@/utils/measure-helper';
import React from 'react';
import { Route, Switch } from 'react-router';
import { MainProvider } from '../Main/Provider';
import { t } from 'tailchat-shared';
import { PersonalConverse } from '../Main/Content/Personal/Converse';
import { GroupPanelRender } from '../Main/Content/Group/Panel';

export const PanelRoute: React.FC = React.memo(() => {
  useRecordMeasure('AppRouteRenderStart');

  return (
    <div className="flex h-full">
      <MainProvider>
        <Switch>
          <Route
            exact={true}
            path="/panel/personal/converse/:converseId"
            component={PersonalConverse}
          />
          <Route
            exact={true}
            path="/panel/group/:groupId/:panelId"
            component={GroupPanelRender}
          />

          <Route>{t('未知的面板')}</Route>
        </Switch>
      </MainProvider>
    </div>
  );
});
PanelRoute.displayName = 'PanelRoute';
