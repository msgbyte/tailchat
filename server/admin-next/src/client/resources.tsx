import React, { useEffect, useState } from 'react';
import {
  Alert,
  Checkbox,
  Dropdown,
  Image,
  Input,
  Menu,
  Pagination,
  Popconfirm,
  Switch,
  Table,
  Tag,
  Tooltip,
  type TableColumnProps,
} from '@arco-design/web-react';
import filesize from 'filesize';
import { api, callAction, listResource } from './api';
import {
  downloadCSV,
  getValue,
  parseUrlStr,
  toCSV,
  type RouteId,
} from './core';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Modal,
  PageHeader,
  useToast,
} from './components';
import { Icon } from './icons';
import { useI18n, type Language } from './i18n';

type Label = { zh: string; en: string };
type FieldType =
  | 'text'
  | 'email'
  | 'boolean'
  | 'date'
  | 'json'
  | 'number'
  | 'image'
  | 'filesize'
  | 'textarea';
type UserAction = 'delete' | 'reset' | 'ban' | 'unban';

interface Field {
  key: string;
  label: Label;
  type?: FieldType;
  sortable?: boolean;
  editable?: boolean;
  required?: boolean;
  wide?: boolean;
  defaultValue?: unknown;
}

interface ResourceSchema {
  route: RouteId;
  resource: string;
  fields: Field[];
  create?: boolean;
  edit?: boolean;
  remove?: boolean;
  batchRemove?: boolean;
  export?: boolean;
  pageSizes?: number[];
}

const L = (zh: string, en: string): Label => ({ zh, en });
const id = (sortable = false): Field => ({
  key: 'id',
  label: L('ID', 'ID'),
  sortable,
});
const createdAt: Field = {
  key: 'createdAt',
  label: L('创建时间', 'Created at'),
  type: 'date',
  sortable: true,
};

const schemas: Record<string, ResourceSchema> = {
  users: {
    route: 'users',
    resource: 'users',
    create: true,
    edit: true,
    remove: true,
    export: true,
    fields: [
      id(true),
      {
        key: 'email',
        label: L('邮箱', 'Email'),
        type: 'email',
        editable: true,
        required: true,
      },
      { key: 'nickname', label: L('昵称', 'Nickname'), editable: true },
      {
        key: 'discriminator',
        label: L('识别码', 'Discriminator'),
        editable: true,
        required: true,
      },
      {
        key: 'temporary',
        label: L('临时用户', 'Temporary'),
        type: 'boolean',
        editable: true,
      },
      {
        key: 'avatar',
        label: L('头像', 'Avatar'),
        type: 'image',
        editable: true,
      },
      { key: 'type', label: L('类型', 'Type') },
      {
        key: 'emailVerified',
        label: L('邮箱已验证', 'Email verified'),
        type: 'boolean',
        editable: true,
      },
      { key: 'banned', label: L('已封禁', 'Banned'), type: 'boolean' },
      { key: 'lastLoginIp', label: L('最后登录 IP', 'Last login IP') },
      {
        key: 'lastLoginAt',
        label: L('最后登录时间', 'Last login at'),
        type: 'date',
      },
      {
        key: 'lastLoginUserAgent',
        label: L('最后登录设备', 'Last user agent'),
        wide: true,
      },
      {
        key: 'settings',
        label: L('设置', 'Settings'),
        type: 'json',
        editable: true,
        wide: true,
      },
      createdAt,
    ],
  },
  'login-logs': {
    route: 'login-logs',
    resource: 'user_login_logs',
    export: true,
    fields: [
      id(true),
      { key: 'userId', label: L('用户 ID', 'User ID') },
      { key: 'ip', label: L('IP 地址', 'IP address'), sortable: true },
      { key: 'userAgent', label: L('设备信息', 'User agent'), wide: true },
      createdAt,
    ],
  },
  messages: {
    route: 'messages',
    resource: 'messages',
    edit: true,
    remove: true,
    batchRemove: true,
    export: true,
    fields: [
      id(true),
      {
        key: 'content',
        label: L('内容', 'Content'),
        type: 'textarea',
        editable: true,
        wide: true,
      },
      { key: 'author', label: L('发送者', 'Author'), editable: true },
      { key: 'groupId', label: L('群组 ID', 'Group ID'), editable: true },
      {
        key: 'converseId',
        label: L('会话 ID', 'Conversation ID'),
        editable: true,
      },
      {
        key: 'hasRecall',
        label: L('已撤回', 'Recalled'),
        type: 'boolean',
        editable: true,
      },
      {
        key: 'reactions',
        label: L('回应', 'Reactions'),
        type: 'json',
        editable: true,
        wide: true,
      },
      createdAt,
    ],
  },
  groups: {
    route: 'groups',
    resource: 'groups',
    create: true,
    edit: true,
    remove: true,
    export: true,
    fields: [
      id(),
      { key: 'name', label: L('名称', 'Name'), editable: true, required: true },
      {
        key: 'owner',
        label: L('所有者', 'Owner'),
        editable: true,
        required: true,
      },
      { key: 'members.length', label: L('成员数', 'Members') },
      { key: 'panels.length', label: L('面板数', 'Panels') },
      { key: 'roles', label: L('角色', 'Roles'), type: 'json', wide: true },
      {
        key: 'fallbackPermissions',
        label: L('默认权限', 'Fallback permissions'),
        type: 'json',
        wide: true,
      },
      createdAt,
    ],
  },
  files: {
    route: 'files',
    resource: 'file',
    remove: true,
    batchRemove: true,
    export: true,
    pageSizes: [20, 50, 100, 500, 2000],
    fields: [
      { key: 'objectName', label: L('对象名称', 'Object name'), wide: true },
      { key: 'url', label: L('预览', 'Preview'), type: 'image' },
      { key: 'usage', label: L('用途', 'Usage') },
      {
        key: 'size',
        label: L('大小', 'Size'),
        type: 'filesize',
        sortable: true,
      },
      { key: 'metaData.content-type', label: L('内容类型', 'Content type') },
      { key: 'etag', label: L('ETag', 'ETag'), wide: true },
      { key: 'userId', label: L('用户 ID', 'User ID') },
      createdAt,
    ],
  },
  mail: {
    route: 'mail',
    resource: 'mail',
    export: true,
    fields: [
      { key: 'to', label: L('收件人', 'Recipient') },
      { key: 'subject', label: L('主题', 'Subject'), wide: true },
      { key: 'host', label: L('主机', 'Host') },
      { key: 'port', label: L('端口', 'Port'), type: 'number' },
      { key: 'secure', label: L('安全连接', 'Secure'), type: 'boolean' },
      { key: 'is_success', label: L('发送成功', 'Succeeded'), type: 'boolean' },
      {
        key: 'data',
        label: L('响应数据', 'Response data'),
        type: 'json',
        wide: true,
      },
      { key: 'error', label: L('错误', 'Error'), wide: true },
      createdAt,
    ],
  },
  discover: {
    route: 'discover',
    resource: 'p_discover',
    create: true,
    remove: true,
    fields: [
      {
        key: 'groupId',
        label: L('群组 ID', 'Group ID'),
        editable: true,
        required: true,
      },
      {
        key: 'active',
        label: L('启用', 'Active'),
        type: 'boolean',
        editable: true,
        defaultValue: true,
      },
      {
        key: 'order',
        label: L('排序', 'Order'),
        type: 'number',
        editable: true,
        defaultValue: 0,
        sortable: true,
      },
    ],
  },
};

function formatValue(
  value: unknown,
  field: Field,
  language: Language
): React.ReactNode {
  if (field.type === 'boolean')
    return (
      <Tag color={value ? 'green' : 'gray'}>
        {value
          ? language === 'zh'
            ? '是'
            : 'Yes'
          : language === 'zh'
          ? '否'
          : 'No'}
      </Tag>
    );
  if (field.type === 'date' && value)
    return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(String(value)));
  if (field.type === 'filesize') return filesize(Number(value || 0));
  if (field.type === 'image' && value)
    return (
      <Image
        className="table-image"
        src={parseUrlStr(String(value))}
        alt=""
        width={56}
        height={56}
      />
    );
  if (typeof value === 'object' && value !== null) return JSON.stringify(value);
  return value === null || value === undefined || value === ''
    ? '—'
    : String(value);
}

function initialData(schema: ResourceSchema, record?: Record<string, unknown>) {
  return Object.fromEntries(
    schema.fields
      .filter((field) => field.editable)
      .map((field) => [
        field.key,
        record
          ? getValue(record, field.key) ?? ''
          : field.defaultValue ?? (field.type === 'boolean' ? false : ''),
      ])
  );
}

function setPath(
  target: Record<string, unknown>,
  path: string,
  value: unknown
) {
  const keys = path.split('.');
  let cursor = target;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) cursor[key] = value;
    else cursor = cursor[key] = (cursor[key] as Record<string, unknown>) || {};
  });
}

function ResourceForm({
  schema,
  record,
  onClose,
  onSaved,
}: {
  schema: ResourceSchema;
  record?: Record<string, unknown>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { language, t } = useI18n();
  const notify = useToast();
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    initialData(schema, record)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fields = schema.fields.filter((field) => field.editable);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const missing = fields.find(
      (field) => field.required && !String(values[field.key] ?? '').trim()
    );
    if (missing)
      return setError(`${missing.label[language]}: ${t('common.required')}`);
    if (values.discriminator && !/^\d{4}$/.test(String(values.discriminator)))
      return setError(
        language === 'zh'
          ? '识别码必须为 4 位数字'
          : 'Discriminator must contain 4 digits'
      );
    const payload: Record<string, unknown> = {};
    try {
      fields.forEach((field) => {
        let value = values[field.key];
        if (field.type === 'json' && typeof value === 'string')
          value = value.trim() ? JSON.parse(value) : {};
        if (field.type === 'number') value = Number(value);
        setPath(payload, field.key, value);
      });
      setSaving(true);
      await api(`/${schema.resource}${record ? `/${record.id}` : ''}`, {
        method: record ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      notify(t('common.success'));
      onSaved();
      onClose();
    } catch (err) {
      setError(
        err instanceof SyntaxError ? t('common.invalidJson') : String(err)
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={save}>
      <div className="form-grid">
        {fields.map((field) => (
          <label
            className={
              field.type === 'textarea' || field.type === 'json'
                ? 'form-wide'
                : ''
            }
            key={field.key}
          >
            <span>
              {field.label[language]}
              {field.required && ' *'}
            </span>
            {field.type === 'boolean' ? (
              <Switch
                checked={Boolean(values[field.key])}
                onChange={(checked) =>
                  setValues({ ...values, [field.key]: checked })
                }
              />
            ) : field.type === 'textarea' || field.type === 'json' ? (
              <Input.TextArea
                rows={field.type === 'json' ? 6 : 4}
                value={
                  typeof values[field.key] === 'object'
                    ? JSON.stringify(values[field.key], null, 2)
                    : String(values[field.key] ?? '')
                }
                onChange={(value) =>
                  setValues({ ...values, [field.key]: value })
                }
              />
            ) : (
              <Input
                type={
                  field.type === 'email'
                    ? 'email'
                    : field.type === 'number'
                    ? 'number'
                    : 'text'
                }
                value={String(values[field.key] ?? '')}
                onChange={(value) =>
                  setValues({ ...values, [field.key]: value })
                }
              />
            )}
          </label>
        ))}
      </div>
      {error && <Alert type="error" content={error} />}
      <div className="modal-inline-footer">
        <Button type="button" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? t('common.loading') : t('common.save')}
        </Button>
      </div>
    </form>
  );
}

export function UserPicker({
  onSelect,
}: {
  onSelect: (record: Record<string, unknown>) => void;
}) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!query.trim()) return setRows([]);
      listResource('users', {
        page: 1,
        perPage: 8,
        sort: 'id',
        order: 'ASC',
        search: query,
      })
        .then((result) => setRows(result.rows))
        .catch(() => setRows([]));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);
  return (
    <div className="user-picker">
      <Input
        className="search-input"
        prefix={<Icon name="search" />}
        value={query}
        onChange={setQuery}
        placeholder={t('resource.selectUser')}
        allowClear
      />
      {!!rows.length && (
        <div className="picker-results">
          {rows.map((row) => (
            <Button
              className="picker-result"
              variant="ghost"
              key={String(row.id)}
              type="button"
              onClick={() => {
                onSelect(row);
                setQuery('');
                setRows([]);
              }}
            >
              <span>
                {String(row.nickname || row.email || row.id)}
                {row.discriminator ? `#${row.discriminator}` : ''}
              </span>
              <small>{String(row.email || row.id)}</small>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({
  schema,
  record,
}: {
  schema: ResourceSchema;
  record: Record<string, unknown>;
}) {
  const { language } = useI18n();
  return (
    <dl className="detail-grid">
      {schema.fields.map((field) => (
        <div key={field.key}>
          <dt>{field.label[language]}</dt>
          <dd>{formatValue(getValue(record, field.key), field, language)}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ResourcePage({ route }: { route: keyof typeof schemas }) {
  const schema = schemas[route];
  const { t, language } = useI18n();
  const notify = useToast();
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(schema.pageSizes?.[0] || 20);
  const [sort, setSort] = useState(
    schema.fields.find((field) => field.sortable)?.key || 'id'
  );
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [draftSearch, setDraftSearch] = useState('');
  const [search, setSearch] = useState('');
  const [chatOnly, setChatOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);
  const [editing, setEditing] = useState<
    Record<string, unknown> | 'create' | null
  >(null);
  const [addingMember, setAddingMember] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [pendingUserAction, setPendingUserAction] = useState<{
    id: string;
    action: UserAction;
  } | null>(null);
  const [storageTotal, setStorageTotal] = useState<number | null>(null);
  const [revision, setRevision] = useState(0);
  const filters =
    route === 'files' && chatOnly ? { meta: 'onlyChat' } : undefined;
  const load = () => {
    setLoading(true);
    setError('');
    listResource(schema.resource, {
      page,
      perPage,
      sort,
      order,
      search,
      filters,
    })
      .then((result) => {
        setRows(result.rows);
        setTotal(result.total);
        setSelected([]);
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  };
  useEffect(load, [page, perPage, sort, order, search, chatOnly, revision]);
  useEffect(() => {
    if (route === 'files')
      api<{ totalSize: number }>('/file/filesizeSum')
        .then((result) => setStorageTotal(result.totalSize))
        .catch(() => setStorageTotal(null));
  }, [route, revision]);
  const refresh = () => setRevision((value) => value + 1);
  const remove = async (record: Record<string, unknown>) => {
    try {
      await api(`/${schema.resource}/${record.id}`, { method: 'DELETE' });
      notify(t('common.success'));
      refresh();
    } catch (err) {
      notify(String(err), 'error');
    }
  };
  const removeSelected = async () => {
    try {
      await Promise.all(
        selected.map((recordId) =>
          api(`/${schema.resource}/${recordId}`, { method: 'DELETE' })
        )
      );
      notify(t('common.success'));
      refresh();
    } catch (err) {
      notify(String(err), 'error');
    }
  };
  const exportAll = async () => {
    notify(t('resource.exporting'));
    try {
      const all: Record<string, unknown>[] = [];
      const batch = Math.min(500, schema.pageSizes?.at(-1) || 500);
      for (let current = 1; ; current += 1) {
        const result = await listResource(schema.resource, {
          page: current,
          perPage: batch,
          sort,
          order,
          search,
          filters,
        });
        all.push(...result.rows);
        if (all.length >= result.total || result.rows.length === 0) break;
      }
      downloadCSV(
        `${schema.resource}-${new Date().toISOString().slice(0, 10)}.csv`,
        toCSV(
          all,
          schema.fields.map((field) => ({
            key: field.key,
            label: field.label[language],
          }))
        )
      );
    } catch (err) {
      notify(String(err), 'error');
    }
  };
  const customUserAction = async (
    record: Record<string, unknown>,
    action: 'reset' | 'ban' | 'unban'
  ) => {
    try {
      if (action === 'reset')
        await api(`/users/${record.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            password:
              '$2a$10$eSebpg0CEvsbDC7j1NxB2epMUkYwKhfT8vGdPQYkfeXYMqM8HjnpW',
          }),
        });
      else
        await api(`/user/${action}`, {
          method: 'POST',
          body: JSON.stringify({ userId: record.id }),
        });
      notify(t('common.success'));
      refresh();
    } catch (err) {
      notify(String(err), 'error');
    }
  };
  const columns: TableColumnProps<Record<string, unknown>>[] = [
    ...schema.fields.map(
      (field): TableColumnProps<Record<string, unknown>> => ({
        title: field.label[language],
        dataIndex: field.key,
        width: field.wide ? 260 : field.type === 'image' ? 90 : 160,
        ellipsis: field.type !== 'image',
        sorter: field.sortable,
        sortDirections: ['ascend', 'descend'],
        sortOrder:
          sort === field.key
            ? order === 'ASC'
              ? 'ascend'
              : 'descend'
            : undefined,
        render: (_, record) => (
          <div className="cell-content">
            {formatValue(getValue(record, field.key), field, language)}
          </div>
        ),
      })
    ),
    {
      title: t('common.actions'),
      key: 'actions',
      fixed: 'right',
      width: route === 'users' ? 120 : 150,
      render: (_, record) => {
        const banAction: UserAction = record.banned ? 'unban' : 'ban';
        const recordId = String(record.id);
        const pendingAction =
          pendingUserAction?.id === recordId ? pendingUserAction.action : null;
        const confirmation =
          pendingAction === 'delete'
            ? t('common.confirmDelete')
            : pendingAction
            ? t(
                pendingAction === 'reset'
                  ? 'resource.resetPasswordConfirm'
                  : `resource.${pendingAction}Confirm`
              )
            : '';
        return (
          <div className="row-actions">
            <Tooltip content={t('common.details')}>
              <Button
                variant="ghost"
                icon="eye"
                aria-label={t('common.details')}
                onClick={() => setDetail(record)}
              />
            </Tooltip>
            {schema.edit && (
              <Tooltip content={t('common.edit')}>
                <Button
                  variant="ghost"
                  icon="edit"
                  aria-label={t('common.edit')}
                  onClick={() => setEditing(record)}
                />
              </Tooltip>
            )}
            {schema.remove && route !== 'users' && (
              <Popconfirm
                title={t('common.confirmDelete')}
                onOk={() => remove(record)}
              >
                <Tooltip content={t('common.delete')}>
                  <Button
                    className="danger-action"
                    variant="ghost"
                    icon="trash"
                    aria-label={t('common.delete')}
                  />
                </Tooltip>
              </Popconfirm>
            )}
            {route === 'users' && (
              <Popconfirm
                popupVisible={Boolean(pendingAction)}
                title={confirmation}
                onVisibleChange={(visible) => {
                  if (!visible) setPendingUserAction(null);
                }}
                onOk={() =>
                  pendingAction === 'delete'
                    ? remove(record)
                    : pendingAction
                    ? customUserAction(record, pendingAction)
                    : undefined
                }
              >
                <Dropdown
                  trigger="click"
                  position="br"
                  droplist={
                    <Menu
                      className="user-action-menu"
                      onClickMenuItem={(action) =>
                        setPendingUserAction({
                          id: recordId,
                          action: action as UserAction,
                        })
                      }
                    >
                      <Menu.Item key="delete" className="danger-action">
                        <Icon name="trash" />
                        {t('common.delete')}
                      </Menu.Item>
                      <Menu.Item key="reset">
                        <Icon name="refresh" />
                        {t('resource.resetPassword')}
                      </Menu.Item>
                      <Menu.Item key={banAction}>
                        <Icon name={record.banned ? 'check' : 'warning'} />
                        {t(`resource.${banAction}`)}
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button
                    variant="ghost"
                    icon="more"
                    aria-label={t('common.more')}
                    title={t('common.more')}
                  />
                </Dropdown>
              </Popconfirm>
            )}
            {route === 'groups' && (
              <Tooltip content={t('resource.addMember')}>
                <Button
                  variant="ghost"
                  icon="plus"
                  aria-label={t('resource.addMember')}
                  onClick={() => setAddingMember(record)}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <>
      <PageHeader
        title={t(`route.${schema.route}`)}
        description={t(`description.${schema.route}`)}
        actions={
          <>
            {schema.export && (
              <Button icon="download" onClick={exportAll}>
                {t('common.export')}
              </Button>
            )}
            <Button icon="refresh" onClick={refresh}>
              {t('common.refresh')}
            </Button>
            {schema.create && (
              <Button
                icon="plus"
                variant="primary"
                onClick={() => setEditing('create')}
              >
                {t('common.create')}
              </Button>
            )}
          </>
        }
      />
      {route === 'files' && storageTotal !== null && (
        <div className="inline-stat">
          <span>{t('resource.storageTotal')}</span>
          <strong>{filesize(storageTotal)}</strong>
        </div>
      )}
      <Card>
        <div className="table-toolbar">
          <form
            className="table-search"
            onSubmit={(event) => {
              event.preventDefault();
              setPage(1);
              setSearch(draftSearch);
            }}
          >
            <Input
              className="search-input"
              prefix={<Icon name="search" />}
              value={draftSearch}
              onChange={setDraftSearch}
              placeholder={t('resource.searchPlaceholder')}
              allowClear
            />
          </form>
          {route === 'files' && (
            <Checkbox
              checked={chatOnly}
              onChange={(checked) => {
                setPage(1);
                setChatOnly(checked);
              }}
            >
              {t('resource.chatOnly')}
            </Checkbox>
          )}
          {!!selected.length && schema.batchRemove && (
            <>
              <span className="selection-count">
                {t('common.selected', { count: selected.length })}
              </span>
              <Popconfirm
                title={t('common.confirmBatchDelete', {
                  count: selected.length,
                })}
                onOk={removeSelected}
              >
                <Button icon="trash" variant="danger">
                  {t('common.delete')}
                </Button>
              </Popconfirm>
            </>
          )}
        </div>
        {error ? (
          <ErrorState retry={load} message={error} />
        ) : (
          <Table
            className="admin-table resource-table"
            columns={columns}
            data={rows}
            loading={loading}
            rowKey={(record) => String(record.id)}
            pagination={false}
            noDataElement={
              <EmptyState
                message={search ? t('common.noSearchResults') : undefined}
              />
            }
            rowSelection={
              schema.batchRemove
                ? {
                    selectedRowKeys: selected,
                    onChange: (keys) => setSelected(keys.map(String)),
                  }
                : undefined
            }
            scroll={{
              x: schema.fields.reduce(
                (width, field) =>
                  width +
                  (field.wide ? 260 : field.type === 'image' ? 90 : 160),
                route === 'users' ? 120 : 150
              ),
            }}
            onChange={(_, sorterInfo) => {
              const current = Array.isArray(sorterInfo)
                ? sorterInfo[0]
                : sorterInfo;
              if (!current?.field || !current.direction) return;
              setPage(1);
              setSort(String(current.field));
              setOrder(current.direction === 'ascend' ? 'ASC' : 'DESC');
            }}
          />
        )}
        <div className="resource-pagination">
          <Pagination
            current={page}
            pageSize={perPage}
            total={total}
            sizeCanChange
            sizeOptions={schema.pageSizes || [20, 50, 100]}
            showTotal={(value) => t('common.total', { total: value })}
            onChange={(nextPage, nextSize) => {
              if (nextSize !== perPage) {
                setPage(1);
                setPerPage(nextSize);
              } else setPage(nextPage);
            }}
          />
        </div>
      </Card>
      {detail && (
        <Modal title={t('common.details')} wide onClose={() => setDetail(null)}>
          <Detail schema={schema} record={detail} />
        </Modal>
      )}
      {editing && (
        <Modal
          title={editing === 'create' ? t('common.create') : t('common.edit')}
          wide
          onClose={() => setEditing(null)}
        >
          <ResourceForm
            schema={schema}
            record={editing === 'create' ? undefined : editing}
            onClose={() => setEditing(null)}
            onSaved={refresh}
          />
        </Modal>
      )}
      {addingMember && (
        <AddMemberModal
          group={addingMember}
          onClose={() => setAddingMember(null)}
        />
      )}
    </>
  );
}

function AddMemberModal({
  group,
  onClose,
}: {
  group: Record<string, unknown>;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const notify = useToast();
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const save = async () => {
    if (!user) return notify(t('resource.noUser'), 'error');
    try {
      await callAction('group.addMember', {
        groupId: group.id,
        userId: user.id,
      });
      notify(t('common.success'));
      onClose();
    } catch (err) {
      notify(String(err), 'error');
    }
  };
  return (
    <Modal
      title={t('resource.addMember')}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button variant="primary" onClick={save}>
            {t('common.confirm')}
          </Button>
        </>
      }
    >
      <UserPicker onSelect={setUser} />
      {user && (
        <div className="selected-user">
          <span>{String(user.nickname || user.email || user.id)}</span>
          <small>{String(user.email || user.id)}</small>
        </div>
      )}
    </Modal>
  );
}
