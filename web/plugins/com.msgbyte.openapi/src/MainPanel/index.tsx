import React, { useMemo, useState } from 'react';
import {
  postRequest,
  useAsyncRefresh,
  openModal,
  closeModal,
} from '@capital/common';
import { LoadingSpinner, Space, Table, Button } from '@capital/component';
import { OpenApp } from './types';
import AppInfo from './AppInfo';
import { OpenAppInfoProvider } from './context';
import { CreateOpenApp } from '../modals/CreateOpenApp';
import './index.less';

const OpenApiMainPanel: React.FC = React.memo(() => {
  const [appInfo, setAppInfo] = useState<OpenApp | null>(null);
  const {
    loading,
    value: allApps,
    refresh,
  } = useAsyncRefresh(async (): Promise<OpenApp[]> => {
    const { data } = await postRequest('/openapi/app/all');

    return data ?? [];
  }, []);

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
            <Button onClick={() => setAppInfo(record)}>进入</Button>
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="plugin-openapi-main-panel">
      {appInfo ? (
        <OpenAppInfoProvider appInfo={appInfo}>
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
  );
});
OpenApiMainPanel.displayName = 'OpenApiMainPanel';

export default OpenApiMainPanel;
