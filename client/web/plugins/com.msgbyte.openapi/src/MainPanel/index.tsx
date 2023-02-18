import React, { useMemo } from 'react';
import { openModal, closeModal } from '@capital/common';
import { Space, Table, Button, Loading } from '@capital/component';
import { OpenApp } from './types';
import AppInfo from './AppInfo';
import { OpenAppInfoProvider } from './context';
import { CreateOpenApp } from '../modals/CreateOpenApp';
import { ServiceChecker } from '../components/ServiceChecker';
import { useOpenAppList } from './useOpenAppList';
import { Translate } from '../translate';
import './index.less';

const OpenApiMainPanel: React.FC = React.memo(() => {
  const { loading, allApps, refresh, appInfo, handleSetSelectedApp } =
    useOpenAppList();

  const columns = useMemo(
    () => [
      {
        title: Translate.name,
        dataIndex: 'appName',
      },
      {
        title: Translate.operation,
        key: 'action',
        render: (_, record: OpenApp) => (
          <Space>
            <Button onClick={() => handleSetSelectedApp(record._id)}>
              {Translate.enter}
            </Button>
          </Space>
        ),
      },
    ],
    []
  );

  const handleCreateOpenApp = () => {
    const key = openModal(
      <CreateOpenApp
        onSuccess={() => {
          refresh();
          closeModal(key);
        }}
      />
    );
  };

  return (
    <Loading spinning={loading} style={{ height: '100%' }}>
      <div className="plugin-openapi-main-panel">
        {appInfo ? (
          <OpenAppInfoProvider appInfo={appInfo} refresh={refresh}>
            <AppInfo />
          </OpenAppInfoProvider>
        ) : (
          <>
            <Button
              style={{ marginBottom: 10 }}
              type="primary"
              onClick={handleCreateOpenApp}
            >
              {Translate.createApplication}
            </Button>
            <Table columns={columns} dataSource={allApps} pagination={false} />
          </>
        )}
      </div>
    </Loading>
  );
});
OpenApiMainPanel.displayName = 'OpenApiMainPanel';

const OpenApiMainPanelWrapper = () => {
  return (
    <ServiceChecker>
      <OpenApiMainPanel />
    </ServiceChecker>
  );
};

export default OpenApiMainPanelWrapper;
