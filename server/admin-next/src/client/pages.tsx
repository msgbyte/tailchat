import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Input,
  Popconfirm,
  Radio,
  Switch,
  Table,
  Tag,
  Upload,
  type TableColumnProps,
} from '@arco-design/web-react';
import { Editor } from '@bytemd/react';
import gfm from '@bytemd/plugin-gfm';
import filesize from 'filesize';
import 'bytemd/dist/index.css';
import { api, listResource } from './api';
import {
  BarChart,
  Button,
  Card,
  EmptyState,
  ErrorState,
  LineChart,
  LoadingState,
  PageHeader,
  useToast,
} from './components';
import { parseUrlStr, validateNotification, type RouteId } from './core';
import { Icon } from './icons';
import { useI18n } from './i18n';
import { UserPicker } from './resources';

type Summary = { date: string; count: number };

export function DashboardPage({ username }: { username: string }) {
  const { t } = useI18n();
  const [data, setData] = useState<{
    counts: number[];
    users: Summary[];
    messages: Summary[];
  } | null>(null);
  const [error, setError] = useState('');
  const load = () => {
    setError('');
    Promise.all([
      listResource('users', { page: 1, perPage: 1, sort: 'id', order: 'DESC' }),
      listResource('groups', {
        page: 1,
        perPage: 1,
        sort: 'id',
        order: 'DESC',
      }),
      listResource('file', { page: 1, perPage: 1, sort: 'id', order: 'DESC' }),
      listResource('messages', {
        page: 1,
        perPage: 1,
        sort: 'id',
        order: 'DESC',
      }),
      api<{ summary: Summary[] }>('/user/count/summary'),
      api<{ summary: Summary[] }>('/message/count/summary'),
    ])
      .then(([users, groups, files, messages, userSummary, messageSummary]) =>
        setData({
          counts: [users.total, groups.total, files.total, messages.total],
          users: userSummary.summary,
          messages: messageSummary.summary,
        })
      )
      .catch((err) => setError(String(err)));
  };
  useEffect(load, []);
  const cards = ['users', 'groups', 'files', 'messages'] as const;
  return (
    <>
      <PageHeader
        title={t('dashboard.welcome', { name: username })}
        description={t('description.dashboard')}
        actions={
          <Button icon="refresh" onClick={load}>
            {t('common.refresh')}
          </Button>
        }
      />
      {!data && !error ? (
        <LoadingState />
      ) : error ? (
        <ErrorState retry={load} message={error} />
      ) : (
        data && (
          <>
            <div className="kpi-grid">
              {cards.map((name, index) => (
                <Card className="kpi-card" key={name}>
                  <span className={`kpi-icon kpi-${name}`}>
                    <Icon
                      name={
                        name === 'groups'
                          ? 'group'
                          : name === 'files'
                          ? 'file'
                          : name === 'messages'
                          ? 'message'
                          : 'users'
                      }
                    />
                  </span>
                  <div>
                    <span>{t(`dashboard.${name}`)}</span>
                    <strong>
                      {new Intl.NumberFormat().format(data.counts[index])}
                    </strong>
                  </div>
                </Card>
              ))}
            </div>
            <div className="chart-grid-layout">
              <Card className="chart-card">
                <header>
                  <div>
                    <h2>{t('dashboard.newUsers')}</h2>
                    <span>{t('dashboard.realData')}</span>
                  </div>
                  <strong>
                    {data.users.reduce((sum, item) => sum + item.count, 0)}
                  </strong>
                </header>
                <LineChart
                  data={data.users.map((item) => ({
                    label: item.date.slice(5),
                    value: item.count,
                  }))}
                />
              </Card>
              <Card className="chart-card">
                <header>
                  <div>
                    <h2>{t('dashboard.messageCount')}</h2>
                    <span>{t('dashboard.realData')}</span>
                  </div>
                  <strong>
                    {data.messages.reduce((sum, item) => sum + item.count, 0)}
                  </strong>
                </header>
                <LineChart
                  data={data.messages.map((item) => ({
                    label: item.date.slice(5),
                    value: item.count,
                  }))}
                />
              </Card>
            </div>
          </>
        )
      )}
    </>
  );
}

interface AnalyticsData {
  activeGroups: { groupId: string; groupName: string; messageCount: number }[];
  activeUsers: { userId: string; userName: string; messageCount: number }[];
  largeGroups: { _id: string; name: string; memberCount: number }[];
  fileStorageUserTop: {
    userId: string;
    userName: string;
    fileStorageTotal: number;
  }[];
}

export function AnalyticsPage() {
  const { t } = useI18n();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState('');
  const load = () => {
    setError('');
    Promise.all([
      api<Pick<AnalyticsData, 'activeGroups'>>('/analytics/activeGroups'),
      api<Pick<AnalyticsData, 'activeUsers'>>('/analytics/activeUsers'),
      api<Pick<AnalyticsData, 'largeGroups'>>('/analytics/largeGroups'),
      api<Pick<AnalyticsData, 'fileStorageUserTop'>>(
        '/analytics/fileStorageUserTop'
      ),
    ])
      .then(([a, b, c, d]) => setData({ ...a, ...b, ...c, ...d }))
      .catch((err) => setError(String(err)));
  };
  useEffect(load, []);
  return (
    <>
      <PageHeader
        title={t('route.analytics')}
        description={t('description.analytics')}
        actions={
          <Button icon="refresh" onClick={load}>
            {t('common.refresh')}
          </Button>
        }
      />
      {!data && !error ? (
        <LoadingState />
      ) : error ? (
        <ErrorState retry={load} message={error} />
      ) : (
        data && (
          <div className="analytics-grid">
            <MetricCard
              title={t('analytics.activeGroups')}
              subtitle={t('analytics.messages')}
              data={data.activeGroups.map((item) => ({
                label: item.groupName || item.groupId,
                value: item.messageCount,
              }))}
            />
            <MetricCard
              title={t('analytics.activeUsers')}
              subtitle={t('analytics.messages')}
              data={data.activeUsers.map((item) => ({
                label: item.userName || item.userId,
                value: item.messageCount,
              }))}
            />
            <MetricCard
              title={t('analytics.largeGroups')}
              subtitle={t('analytics.members')}
              data={data.largeGroups.map((item) => ({
                label: item.name || item._id,
                value: item.memberCount,
              }))}
            />
            <MetricCard
              title={t('analytics.fileStorage')}
              subtitle={t('analytics.storage')}
              data={data.fileStorageUserTop.map((item) => ({
                label: item.userName || item.userId,
                value: item.fileStorageTotal,
              }))}
              format={(value) => filesize(value)}
            />
          </div>
        )
      )}
    </>
  );
}

function MetricCard({
  title,
  subtitle,
  data,
  format,
}: {
  title: string;
  subtitle: string;
  data: { label: string; value: number }[];
  format?: (value: number) => string;
}) {
  return (
    <Card className="metric-card">
      <header>
        <div>
          <h2>{title}</h2>
          <span>{subtitle}</span>
        </div>
        <Icon name="chart" />
      </header>
      <BarChart data={data} format={format} />
    </Card>
  );
}

interface NetworkData {
  nodes: Record<string, unknown>[];
  services: string[];
  actions: string[];
  events: string[];
}

export function NetworkPage() {
  const { t } = useI18n();
  const notify = useToast();
  const [data, setData] = useState<NetworkData | null>(null);
  const [error, setError] = useState('');
  const [pinging, setPinging] = useState(false);
  const [ping, setPing] = useState<unknown[]>([]);
  const load = () => {
    setError('');
    api<NetworkData>('/network/all')
      .then(setData)
      .catch((err) => setError(String(err)));
  };
  useEffect(load, []);
  const runPing = async () => {
    setPinging(true);
    try {
      const result = await api<unknown[]>('/network/ping');
      setPing(Array.isArray(result) ? result : []);
      notify(
        t('network.latency', {
          count: Array.isArray(result) ? result.length : 0,
        })
      );
    } catch (err) {
      notify(String(err), 'error');
    } finally {
      setPinging(false);
    }
  };
  const nodeColumns: TableColumnProps<Record<string, unknown>>[] = [
    { title: 'ID', dataIndex: 'id', width: 190, ellipsis: true },
    {
      title: 'Host',
      dataIndex: 'hostname',
      width: 160,
      render: (value) => String(value || '—'),
    },
    {
      title: 'IP',
      dataIndex: 'ipList',
      width: 210,
      render: (value) => (Array.isArray(value) ? value.join(', ') : '—'),
    },
    {
      title: t('network.available'),
      dataIndex: 'available',
      width: 130,
      render: (_, node) => (
        <Tag color={node.available ? 'green' : 'red'}>
          {node.local
            ? t('network.local')
            : node.available
            ? t('network.available')
            : t('network.unavailable')}
        </Tag>
      ),
    },
    {
      title: 'Client',
      dataIndex: 'client',
      width: 220,
      render: (value) => <code>{compact(value)}</code>,
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      width: 220,
      render: (value) => <code>{compact(value)}</code>,
    },
  ];
  return (
    <>
      <PageHeader
        title={t('route.network')}
        description={t('description.network')}
        actions={
          <>
            <Button icon="refresh" onClick={load}>
              {t('common.refresh')}
            </Button>
            <Button
              icon="network"
              variant="primary"
              onClick={runPing}
              disabled={pinging}
            >
              {pinging ? t('network.pinging') : t('network.ping')}
            </Button>
          </>
        }
      />
      {!data && !error ? (
        <LoadingState />
      ) : error ? (
        <ErrorState retry={load} message={error} />
      ) : (
        data && (
          <>
            <div className="network-stats">
              <Card>
                <span>{t('network.nodes')}</span>
                <strong>{data.nodes.length}</strong>
              </Card>
              <Card>
                <span>{t('network.services')}</span>
                <strong>{data.services.length}</strong>
              </Card>
              <Card>
                <span>{t('network.actions')}</span>
                <strong>{data.actions.length}</strong>
              </Card>
              <Card>
                <span>{t('network.events')}</span>
                <strong>{data.events.length}</strong>
              </Card>
            </div>
            <Card>
              <div className="section-heading">
                <h2>{t('network.nodes')}</h2>
              </div>
              <Table
                className="admin-table"
                columns={nodeColumns}
                data={data.nodes}
                rowKey={(node) => String(node.id)}
                pagination={false}
                scroll={{ x: 1130 }}
                noDataElement={<EmptyState />}
              />
            </Card>
            {!!ping.length && (
              <Card>
                <div className="section-heading">
                  <h2>{t('network.ping')}</h2>
                </div>
                <pre className="json-view">{JSON.stringify(ping, null, 2)}</pre>
              </Card>
            )}
            <div className="network-detail-grid">
              <StringList
                title={t('network.services')}
                values={data.services}
              />
              <StringList title={t('network.actions')} values={data.actions} />
              <StringList title={t('network.events')} values={data.events} />
            </div>
          </>
        )
      )}
    </>
  );
}

const compact = (value: unknown) => (value ? JSON.stringify(value) : '—');
function StringList({ title, values }: { title: string; values: string[] }) {
  return (
    <Card>
      <div className="section-heading">
        <h2>{title}</h2>
        <span>{values.length}</span>
      </div>
      <div className="tag-list">
        {values.map((value) => (
          <code key={value}>{value}</code>
        ))}
      </div>
    </Card>
  );
}

export function SocketPage() {
  const { t } = useI18n();
  const notify = useToast();
  const socketUrl = `${
    window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  }//${window.location.host}`;
  const copy = async () => {
    await navigator.clipboard.writeText(socketUrl);
    notify(t('common.copied'));
  };
  return (
    <>
      <PageHeader
        title={t('route.socketio')}
        description={t('description.socketio')}
      />
      <div className="center-card">
        <Card className="socket-card">
          <span className="feature-icon">
            <Icon name="socket" size={30} />
          </span>
          <h2>{t('socket.url')}</h2>
          <div className="copy-field">
            <code>{socketUrl}</code>
            <Button icon="copy" onClick={copy}>
              {t('common.copy')}
            </Button>
          </div>
          <p>{t('socket.credentials')}</p>
          <Alert
            className="notice"
            type="warning"
            content={t('socket.notice')}
          />
          <Button
            variant="primary"
            icon="external"
            onClick={() =>
              window.open(
                'https://admin.socket.io/',
                '_blank',
                'noopener,noreferrer'
              )
            }
          >
            {t('socket.open')}
          </Button>
        </Card>
      </div>
    </>
  );
}

export function CachePage() {
  const { t } = useI18n();
  const notify = useToast();
  const [loading, setLoading] = useState('');
  const clean = async (target: 'config.client' | 'all') => {
    setLoading(target);
    try {
      const result = await api<{ success: boolean; message?: string }>(
        '/cache/clean',
        {
          method: 'POST',
          body: JSON.stringify(target === 'all' ? {} : { target }),
        }
      );
      if (!result.success)
        throw new Error(result.message || t('common.failed'));
      notify(t('common.success'));
    } catch (err) {
      notify(String(err), 'error');
    } finally {
      setLoading('');
    }
  };
  return (
    <>
      <PageHeader
        title={t('route.cache')}
        description={t('description.cache')}
      />
      <Alert className="notice" type="warning" content={t('cache.warning')} />
      <div className="cache-grid">
        <Card>
          <span className="feature-icon">
            <Icon name="settings" />
          </span>
          <h2>{t('cache.config')}</h2>
          <Popconfirm
            title={t('cache.confirmConfig')}
            onOk={() => clean('config.client')}
          >
            <Button disabled={!!loading}>
              {loading === 'config.client'
                ? t('common.loading')
                : t('cache.config')}
            </Button>
          </Popconfirm>
        </Card>
        <Card className="danger-card">
          <span className="feature-icon">
            <Icon name="database" />
          </span>
          <h2>{t('cache.all')}</h2>
          <Popconfirm title={t('cache.confirmAll')} onOk={() => clean('all')}>
            <Button variant="danger" disabled={!!loading}>
              {loading === 'all' ? t('common.loading') : t('cache.all')}
            </Button>
          </Popconfirm>
        </Card>
      </div>
    </>
  );
}

export function NotifyPage() {
  const { t } = useI18n();
  const notify = useToast();
  const [scope, setScope] = useState<'all' | 'specified'>('all');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [sending, setSending] = useState(false);
  const plugins = useMemo(() => [gfm()], []);
  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    const invalid = validateNotification(
      scope,
      users.map((user) => String(user.id)),
      title,
      content
    );
    if (invalid)
      return notify(
        t(`notify.need${invalid[0].toUpperCase()}${invalid.slice(1)}`),
        'error'
      );
    setSending(true);
    try {
      const result = await api<{ userIds: string[] }>('/users/system/notify', {
        method: 'POST',
        body: JSON.stringify({
          scope,
          specifiedUser: users.map((user) => user.id),
          title,
          content,
        }),
      });
      notify(t('notify.sent', { count: result.userIds.length }));
      setTitle('');
      setContent('');
      setUsers([]);
    } catch (err) {
      notify(String(err), 'error');
    } finally {
      setSending(false);
    }
  };
  return (
    <>
      <PageHeader
        title={t('route.system-notify')}
        description={t('description.system-notify')}
      />
      <Card className="form-card">
        <form onSubmit={send}>
          <label>
            <span>{t('notify.scope')}</span>
            <Radio.Group type="button" value={scope} onChange={setScope}>
              <Radio value="all">{t('notify.all')}</Radio>
              <Radio value="specified">{t('notify.specified')}</Radio>
            </Radio.Group>
          </label>
          {scope === 'all' ? (
            <Alert
              className="notice"
              type="info"
              content={t('notify.allTip')}
            />
          ) : (
            <label>
              <span>{t('notify.specified')}</span>
              <UserPicker
                onSelect={(user) =>
                  !users.some((item) => item.id === user.id) &&
                  setUsers([...users, user])
                }
              />
              <div className="selected-users">
                {users.map((user) => (
                  <Tag
                    closable
                    key={String(user.id)}
                    onClose={() =>
                      setUsers(users.filter((item) => item.id !== user.id))
                    }
                  >
                    {String(user.nickname || user.email || user.id)}
                  </Tag>
                ))}
              </div>
            </label>
          )}
          <label>
            <span>{t('notify.title')}</span>
            <Input value={title} onChange={setTitle} />
          </label>
          <label>
            <span>{t('notify.content')}</span>
            <div className="markdown-editor">
              <Editor value={content} plugins={plugins} onChange={setContent} />
            </div>
          </label>
          <div className="form-actions">
            <Button
              type="submit"
              variant="primary"
              icon="notify"
              disabled={sending}
            >
              {sending ? t('common.loading') : t('notify.send')}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}

interface ClientConfig {
  uploadFileLimit?: number;
  emailVerification?: boolean;
  disableGuestLogin?: boolean;
  disableUserRegister?: boolean;
  disableCreateGroup?: boolean;
  serverName?: string;
  serverEntryImage?: string;
  announcement?: false | { id?: number; text?: string; link?: string };
  [key: string]: unknown;
}

export function SystemPage() {
  const { t } = useI18n();
  const notify = useToast();
  const [config, setConfig] = useState<ClientConfig | null>(null);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [announcement, setAnnouncement] = useState({
    enable: false,
    text: '',
    link: '',
  });
  const [uploading, setUploading] = useState(false);
  const load = () => {
    setError('');
    api<{ config: ClientConfig }>('/config/client')
      .then(({ config: next }) => {
        setConfig(next);
        setName(next.serverName || '');
        setAnnouncement(
          next.announcement
            ? {
                enable: true,
                text: next.announcement.text || '',
                link: next.announcement.link || '',
              }
            : { enable: false, text: '', link: '' }
        );
      })
      .catch((err) => setError(String(err)));
  };
  useEffect(load, []);
  const patch = async (key: string, value: unknown) => {
    await api('/config/client', {
      method: 'PATCH',
      body: JSON.stringify({ key, value }),
    });
    notify(t('common.success'));
    load();
  };
  const upload = async (file: File) => {
    setUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('usage', 'server');
      const result = await api<{ files: { url: string }[] }>('/file/upload', {
        method: 'PUT',
        body,
      });
      const url = result.files[0]?.url;
      if (!url) throw new Error(t('common.failed'));
      await patch('serverEntryImage', url);
    } catch (err) {
      notify(String(err), 'error');
    } finally {
      setUploading(false);
    }
  };
  if (!config && !error) return <LoadingState />;
  if (error) return <ErrorState retry={load} message={error} />;
  return (
    <>
      <PageHeader
        title={t('route.system')}
        description={t('description.system')}
        actions={
          <Button icon="refresh" onClick={load}>
            {t('common.refresh')}
          </Button>
        }
      />
      <div className="settings-grid">
        <Card className="form-card">
          <div className="section-heading">
            <h2>{t('system.config')}</h2>
          </div>
          <dl className="config-list">
            <ConfigRow
              label={t('system.uploadFileLimit')}
              value={filesize(Number(config?.uploadFileLimit || 0))}
            />
            <ConfigRow
              label={t('system.emailVerification')}
              value={Boolean(config?.emailVerification)}
            />
            <ConfigRow
              label={t('system.allowGuestLogin')}
              value={!config?.disableGuestLogin}
            />
            <ConfigRow
              label={t('system.allowUserRegister')}
              value={!config?.disableUserRegister}
            />
            <ConfigRow
              label={t('system.allowCreateGroup')}
              value={!config?.disableCreateGroup}
            />
          </dl>
          <label>
            <span>{t('system.serverName')}</span>
            <div className="inline-form">
              <Input value={name} onChange={setName} placeholder="Tailchat" />
              <Button onClick={() => patch('serverName', name)}>
                {t('system.saveName')}
              </Button>
            </div>
          </label>
          <label>
            <span>{t('system.serverEntryImage')}</span>
            {config?.serverEntryImage ? (
              <div className="entry-image">
                <img src={parseUrlStr(config.serverEntryImage)} alt="" />
                <Button
                  icon="trash"
                  variant="danger"
                  onClick={() => patch('serverEntryImage', '')}
                >
                  {t('common.remove')}
                </Button>
              </div>
            ) : (
              <Upload
                className="entry-upload"
                accept="image/*"
                autoUpload={false}
                showUploadList={false}
                disabled={uploading}
                onChange={(_, file) =>
                  file.status === 'init' &&
                  file.originFile &&
                  upload(file.originFile)
                }
              >
                <Button icon="plus" disabled={uploading}>
                  {uploading ? t('system.uploading') : t('common.upload')}
                </Button>
              </Upload>
            )}
          </label>
        </Card>
        <Card className="form-card">
          <div className="section-heading">
            <h2>{t('system.announcement')}</h2>
          </div>
          <label className="switch-row">
            <span>{t('system.announcementEnable')}</span>
            <Switch
              checked={announcement.enable}
              onChange={(enable) =>
                setAnnouncement({ ...announcement, enable })
              }
            />
          </label>
          <label>
            <span>{t('system.announcementText')}</span>
            <Input.TextArea
              maxLength={240}
              rows={5}
              value={announcement.text}
              onChange={(text) => setAnnouncement({ ...announcement, text })}
            />
          </label>
          <label>
            <span>{t('system.announcementLink')}</span>
            <Input
              value={announcement.link}
              onChange={(link) => setAnnouncement({ ...announcement, link })}
              placeholder="https://tailchat.msgbyte.com/"
            />
          </label>
          <div className="form-actions">
            <Button
              variant="primary"
              onClick={() =>
                patch(
                  'announcement',
                  announcement.enable
                    ? {
                        id: Date.now(),
                        text: announcement.text,
                        link: announcement.link,
                      }
                    : false
                )
              }
            >
              {t('system.saveAnnouncement')}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

function ConfigRow({
  label,
  value,
}: {
  label: string;
  value: string | boolean;
}) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        {typeof value === 'boolean' ? (
          <Tag
            color={value ? 'green' : 'gray'}
            icon={<Icon name={value ? 'check' : 'close'} size={14} />}
          >
            {value ? 'ON' : 'OFF'}
          </Tag>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export const specialPages: Partial<Record<RouteId, React.ComponentType>> = {
  analytics: AnalyticsPage,
  network: NetworkPage,
  socketio: SocketPage,
  cache: CachePage,
  'system-notify': NotifyPage,
  system: SystemPage,
};
