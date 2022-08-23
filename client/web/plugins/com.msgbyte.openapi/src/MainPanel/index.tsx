import React, { useMemo } from 'react';
import { openModal, closeModal } from '@capital/common';
import { Space, Table, Button, Loading } from '@capital/component';
import { OpenApp } from './types';
import AppInfo from './AppInfo';
import { OpenAppInfoProvider } from './context';
import { CreateOpenApp } from '../modals/CreateOpenApp';
import { ServiceChecker } from '../components/ServiceChecker';
import { useOpenAppList } from './useOpenAppList';
import './index.less';

const OpenApiMainPanel: React.FC = React.memo(() => {
  const { loading, allApps, refresh, appInfo, handleSetSelectedApp } =
    useOpenAppList();

  const columns = useMemo(
    () => [
      {
        title: '名称',
        dataIndex: 'appName',
      },
      {
        title: '操作',
        key: 'action',
        render: (_, record: OpenApp) => (
          <Space>
            <Button onClick={() => handleSetSelectedApp(record._id)}>
              进入
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
              创建应用
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
