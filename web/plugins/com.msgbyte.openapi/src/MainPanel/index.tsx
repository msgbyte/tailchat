import React, { useMemo, useState } from 'react';
import {
  postRequest,
  useAsyncRefresh,
  openModal,
  closeModal,
} from '@capital/common';
import {
  LoadingSpinner,
  Space,
  Table,
  Button,
  Loading,
} from '@capital/component';
import { OpenApp } from './types';
import AppInfo from './AppInfo';
import { OpenAppInfoProvider } from './context';
import { CreateOpenApp } from '../modals/CreateOpenApp';
import { ServiceChecker } from '../components/ServiceChecker';
import './index.less';

const OpenApiMainPanel: React.FC = React.memo(() => {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const {
    loading,
    value: allApps = [],
    refresh,
  } = useAsyncRefresh(async (): Promise<OpenApp[]> => {
    const { data } = await postRequest('/openapi/app/all');

    return data ?? [];
  }, []);
  const appInfo = allApps.find((a) => a._id === selectedAppId);

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
            <Button onClick={() => setSelectedAppId(record._id)}>进入</Button>
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
    <Loading spinning={loading}>
      <div className="plugin-openapi-main-panel">
        {appInfo ? (
          <OpenAppInfoProvider appInfo={appInfo} refresh={refresh}>
            <AppInfo />
          </OpenAppInfoProvider>
        ) : (
          <>
            <Button
              style={{ marginBottom: 4 }}
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
