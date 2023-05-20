import { IconFile, IconUser, IconUserGroup } from 'tushan/icon';
import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'tushan/chart';
import {
  Card,
  Link,
  Space,
  Grid,
  Divider,
  Typography,
  useUserStore,
  createSelector,
  useTranslation,
  useGetList,
  useAsync,
} from 'tushan';
import { request } from '../request';

const { GridItem } = Grid;

export const Dashboard: React.FC = React.memo(() => {
  const { userIdentity } = useUserStore(createSelector('userIdentity'));
  const { t } = useTranslation();

  const { total: usersNum } = useGetList('users', {
    pagination: { page: 1, perPage: 1 },
  });
  const { total: groupNum } = useGetList('groups', {
    pagination: { page: 1, perPage: 1 },
  });
  const { total: fileNum } = useGetList('file', {
    pagination: { page: 1, perPage: 1 },
  });

  return (
    <div>
      <div>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card bordered={false}>
            <Typography.Title heading={5}>
              {t('tushan.dashboard.welcome', {
                name: userIdentity.fullName,
              })}
            </Typography.Title>

            <Divider />

            <Grid.Row justify="center">
              <Grid.Col flex={1} style={{ paddingLeft: '1rem' }}>
                <DataItem
                  icon={<IconUser />}
                  title={t('tushan.dashboard.user')}
                  count={usersNum}
                />
              </Grid.Col>

              <Divider type="vertical" style={{ height: 40 }} />

              <Grid.Col flex={1} style={{ paddingLeft: '1rem' }}>
                <DataItem
                  icon={<IconUserGroup />}
                  title={t('tushan.dashboard.group')}
                  count={groupNum}
                />
              </Grid.Col>

              <Divider type="vertical" style={{ height: 40 }} />

              <Grid.Col flex={1} style={{ paddingLeft: '1rem' }}>
                <DataItem
                  icon={<IconFile />}
                  title={t('custom.dashboard.file')}
                  count={fileNum}
                />
              </Grid.Col>
            </Grid.Row>

            <Divider />

            <Typography.Title heading={6} style={{ marginBottom: 10 }}>
              {t('custom.dashboard.messageCount')}
            </Typography.Title>

            <MessageCountChart />
          </Card>

          <Grid cols={3} colGap={12} rowGap={16}>
            <GridItem index={0}>
              <DashboardItem title="Docs" href="https://tailchat.msgbyte.com/">
                {t('tushan.dashboard.tip.docs')}
              </DashboardItem>
            </GridItem>
            <GridItem index={0}>
              <DashboardItem
                title="Github"
                href="https://github.com/msgbyte/tailchat"
              >
                {t('custom.dashboard.tip.github')}
              </DashboardItem>
            </GridItem>
            <GridItem index={0}>
              <DashboardItem
                title="Provide by Tushan"
                href="https://tushan.msgbyte.com/"
              >
                {t('custom.dashboard.tip.tushan')}
              </DashboardItem>
            </GridItem>
          </Grid>
        </Space>
      </div>
    </div>
  );
});
Dashboard.displayName = 'Dashboard';

const DashboardItem: React.FC<
  React.PropsWithChildren<{
    title: string;
    href?: string;
  }>
> = React.memo((props) => {
  const { t } = useTranslation();

  return (
    <Card
      title={props.title}
      extra={
        props.href && (
          <Link target="_blank" href={props.href}>
            {t('tushan.dashboard.more')}
          </Link>
        )
      }
      bordered={false}
      style={{ overflow: 'hidden' }}
    >
      {props.children}
    </Card>
  );
});
DashboardItem.displayName = 'DashboardItem';

const DataItem: React.FC<{
  icon: React.ReactElement;
  title: string;
  count: number;
}> = React.memo((props) => {
  return (
    <Space>
      <div
        style={{
          fontSize: 20,
          padding: '0.5rem',
          borderRadius: '9999px',
          border: '1px solid #ccc',
          width: 24,
          height: 24,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {props.icon}
      </div>
      <div>
        <div style={{ fontWeight: 700 }}>{props.title}</div>
        <div>{props.count}</div>
      </div>
    </Space>
  );
});
DataItem.displayName = 'DataItem';

const MessageCountChart: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { value: messageCountSummary } = useAsync(async () => {
    const { data } = await request.get<{
      summary: {
        count: number;
        date: string;
      }[];
    }>('/message/count/summary');

    return data.summary;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart
        width={730}
        height={250}
        data={messageCountSummary}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="count"
          label={t('custom.dashboard.messageCount')}
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
});
MessageCountChart.displayName = 'MessageCountChart';
