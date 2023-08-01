import fileSize from 'filesize';
import React from 'react';
import {
  Card,
  Grid,
  Tooltip,
  Typography,
  useAsync,
  useTranslation,
} from 'tushan';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'tushan/chart';
import { request } from '../../request';

export const TailchatAnalytics: React.FC = React.memo(() => {
  const { t } = useTranslation();

  return (
    <div>
      <Grid.Row gutter={4}>
        <Grid.Col md={12}>
          <Card>
            <Typography.Title heading={4}>
              {t('custom.analytics.activeGroupTop5')}
            </Typography.Title>

            <ActiveGroupChart />
          </Card>
        </Grid.Col>

        <Grid.Col md={12}>
          <Card>
            <Typography.Title heading={4}>
              {t('custom.analytics.activeUserTop5')}
            </Typography.Title>

            <ActiveUserChart />
          </Card>
        </Grid.Col>
      </Grid.Row>

      <Grid.Row gutter={4} style={{ marginTop: 8 }}>
        <Grid.Col md={12}>
          <Card>
            <Typography.Title heading={4}>
              {t('custom.analytics.largeGroupTop5')}
            </Typography.Title>

            <LargeGroupChart />
          </Card>
        </Grid.Col>

        <Grid.Col md={12}>
          <Card>
            <Typography.Title heading={4}>
              {t('custom.analytics.fileStorageUserTop5')}
            </Typography.Title>

            <FileStorageChart />
          </Card>
        </Grid.Col>
      </Grid.Row>
    </div>
  );
});
TailchatAnalytics.displayName = 'TailchatAnalytics';

const ActiveGroupChart: React.FC = React.memo(() => {
  const { value } = useAsync(async () => {
    const { data } = await request.get<{
      activeGroups: {
        groupId: string;
        groupName: string;
        messageCount: number;
      }[];
    }>('/analytics/activeGroups');

    return data.activeGroups;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={value}
        layout="vertical"
        maxBarSize={40}
        margin={{ left: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="messageCount" type="number" />
        <YAxis dataKey="groupName" type="category" />
        <Tooltip />
        <Bar dataKey="messageCount" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
});
ActiveGroupChart.displayName = 'ActiveGroupChart';

const ActiveUserChart: React.FC = React.memo(() => {
  const { value } = useAsync(async () => {
    const { data } = await request.get<{
      activeUsers: {
        groupId: string;
        groupName: string;
        messageCount: number;
      }[];
    }>('/analytics/activeUsers');

    return data.activeUsers;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={value}
        layout="vertical"
        maxBarSize={40}
        margin={{ left: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="messageCount" type="number" />
        <YAxis dataKey="userName" type="category" />
        <Tooltip />
        <Bar dataKey="messageCount" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
});
ActiveUserChart.displayName = 'ActiveUserChart';

const LargeGroupChart: React.FC = React.memo(() => {
  const { value } = useAsync(async () => {
    const { data } = await request.get<{
      largeGroups: {
        name: string;
        memberCount: number;
      }[];
    }>('/analytics/largeGroups');

    return data.largeGroups;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={value}
        layout="vertical"
        maxBarSize={40}
        margin={{ left: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="memberCount" type="number" />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Bar dataKey="memberCount" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
});
LargeGroupChart.displayName = 'LargeGroupChart';

const FileStorageChart: React.FC = React.memo(() => {
  const { value } = useAsync(async () => {
    const { data } = await request.get<{
      fileStorageUserTop: {
        userId: string;
        userName: string;
        fileStorageTotal: number;
      }[];
    }>('/analytics/fileStorageUserTop');

    return data.fileStorageUserTop;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={value}
        layout="vertical"
        maxBarSize={40}
        margin={{ left: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="fileStorageTotal"
          type="number"
          tickFormatter={(val) => fileSize(val)}
        />
        <YAxis dataKey="userName" type="category" />
        <Tooltip />
        <Bar dataKey="fileStorageTotal" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
});
FileStorageChart.displayName = 'FileStorageChart';
