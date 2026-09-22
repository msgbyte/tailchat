import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Alert,
  Button as ArcoButton,
  Card as ArcoCard,
  Empty,
  Input,
  Message,
  Modal as ArcoModal,
  Spin,
  type ButtonProps as ArcoButtonProps,
} from '@arco-design/web-react';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ROUTES, type RouteId } from './core';
import { Icon, type IconName } from './icons';
import { useI18n } from './i18n';

export function Button({
  children,
  icon,
  variant = 'secondary',
  className = '',
  type = 'button',
  ...props
}: Omit<
  ArcoButtonProps,
  'className' | 'htmlType' | 'icon' | 'status' | 'type'
> & {
  children?: React.ReactNode;
  className?: string;
  icon?: IconName;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}) {
  return (
    <ArcoButton
      className={`button button-${variant} ${className}`}
      htmlType={type}
      icon={icon ? <Icon name={icon} /> : undefined}
      status={variant === 'danger' ? 'danger' : undefined}
      type={
        variant === 'primary'
          ? 'primary'
          : variant === 'ghost'
          ? 'text'
          : 'secondary'
      }
      {...props}
    >
      {children}
    </ArcoButton>
  );
}

export function Card({
  className = '',
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <ArcoCard className={`card ${className}`} bodyStyle={{ padding: 0 }}>
      {children}
    </ArcoCard>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}

export function LoadingState() {
  const { t } = useI18n();
  return (
    <div className="state">
      <Spin tip={t('common.loading')} />
    </div>
  );
}

export function EmptyState({ message }: { message?: string }) {
  const { t } = useI18n();
  return (
    <div className="state state-empty">
      <Empty description={message || t('common.empty')} />
    </div>
  );
}

export function ErrorState({
  retry,
  message,
}: {
  retry?: () => void;
  message?: string;
}) {
  const { t } = useI18n();
  return (
    <div className="state">
      <Alert
        className="state-error"
        type="error"
        content={message || t('common.loadError')}
        action={retry && <Button onClick={retry}>{t('common.retry')}</Button>}
      />
    </div>
  );
}

export function Modal({
  title,
  children,
  onClose,
  footer,
  wide = false,
}: React.PropsWithChildren<{
  title: string;
  onClose: () => void;
  footer?: React.ReactNode;
  wide?: boolean;
}>) {
  return (
    <ArcoModal
      className={`modal ${wide ? 'modal-wide' : ''}`}
      footer={footer || null}
      onCancel={onClose}
      title={title}
      unmountOnExit
      visible
      wrapClassName="admin-modal"
    >
      {children}
    </ArcoModal>
  );
}

type ToastType = 'success' | 'error';
const ToastContext = createContext<(message: string, type?: ToastType) => void>(
  () => undefined
);

export function ToastProvider({ children }: React.PropsWithChildren) {
  const [messageApi, contextHolder] = Message.useMessage({ duration: 3500 });
  const notify = (message: string, type: ToastType = 'success') => {
    messageApi[type]?.(message);
  };
  return (
    <ToastContext.Provider value={notify}>
      {children}
      {contextHolder}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

const sections: { label: string; routes: { id: RouteId; icon: IconName }[] }[] =
  [
    {
      label: 'nav.overview',
      routes: [
        { id: 'dashboard', icon: 'dashboard' },
        { id: 'analytics', icon: 'chart' },
      ],
    },
    {
      label: 'nav.content',
      routes: [
        { id: 'users', icon: 'users' },
        { id: 'login-logs', icon: 'login' },
        { id: 'messages', icon: 'message' },
        { id: 'groups', icon: 'group' },
        { id: 'files', icon: 'file' },
        { id: 'mail', icon: 'mail' },
      ],
    },
    { label: 'nav.plugins', routes: [{ id: 'discover', icon: 'discover' }] },
    {
      label: 'nav.infrastructure',
      routes: [
        { id: 'network', icon: 'network' },
        { id: 'socketio', icon: 'socket' },
        { id: 'cache', icon: 'database' },
      ],
    },
    {
      label: 'nav.system',
      routes: [
        { id: 'system-notify', icon: 'notify' },
        { id: 'system', icon: 'settings' },
      ],
    },
  ];

const SIDEBAR_STORAGE_KEY = 'tailchat:admin-next:sidebar';

export function AppShell({
  route,
  username,
  navigate,
  logout,
  children,
}: React.PropsWithChildren<{
  route: RouteId;
  username: string;
  navigate: (route: RouteId) => void;
  logout: () => void;
}>) {
  const { t, language, setLanguage } = useI18n();
  const [drawer, setDrawer] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () => window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'collapsed'
  );
  const [palette, setPalette] = useState(false);
  const [query, setQuery] = useState('');
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPalette(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    if (!palette) setQuery('');
  }, [palette]);
  const results = useMemo(
    () =>
      ROUTES.filter((id) => {
        const haystack = `${t(`route.${id}`)} ${id}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      }),
    [query, t]
  );
  const go = (next: RouteId) => {
    navigate(next);
    setDrawer(false);
    setPalette(false);
  };
  const toggleSidebar = () => {
    const next = !collapsed;
    window.localStorage.setItem(
      SIDEBAR_STORAGE_KEY,
      next ? 'collapsed' : 'expanded'
    );
    setCollapsed(next);
  };
  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {drawer && (
        <ArcoButton
          className="drawer-backdrop"
          aria-label={t('common.close')}
          onClick={() => setDrawer(false)}
        />
      )}
      <aside className={`sidebar ${drawer ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <img src="/admin-next/tailchat-logo.svg" alt="Tailchat" />
          <div>
            <strong>{t('app.name')}</strong>
            <span>{t('app.edition')}</span>
          </div>
        </div>
        <nav className="nav" aria-label={t('app.console')}>
          {sections.map((section) => (
            <div className="nav-section" key={section.label}>
              <span className="nav-label">{t(section.label)}</span>
              {section.routes.map((item) => (
                <ArcoButton
                  type="text"
                  key={item.id}
                  className={route === item.id ? 'active' : ''}
                  title={collapsed ? t(`route.${item.id}`) : undefined}
                  onClick={() => go(item.id)}
                >
                  <Icon name={item.icon} />
                  <span>{t(`route.${item.id}`)}</span>
                </ArcoButton>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span>{t('app.footer')}</span>
          <ArcoButton
            type="text"
            className="icon-button sidebar-toggle"
            onClick={toggleSidebar}
            aria-expanded={!collapsed}
            aria-label={t(collapsed ? 'shell.expand' : 'shell.collapse')}
            title={t(collapsed ? 'shell.expand' : 'shell.collapse')}
            icon={<Icon name="chevron" />}
          />
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <ArcoButton
            type="text"
            className="icon-button mobile-only"
            onClick={() => setDrawer(true)}
            aria-label={t('shell.menu')}
            icon={<Icon name="menu" />}
          />
          <ArcoButton
            type="text"
            className="command-trigger"
            onClick={() => setPalette(true)}
          >
            <Icon name="search" />
            <span>{t('shell.command')}</span>
            <kbd>⌘K</kbd>
          </ArcoButton>
          <div className="topbar-spacer" />
          <ArcoButton
            type="text"
            className="topbar-control"
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            aria-label={t('shell.language')}
          >
            <Icon name="language" />
            {language === 'zh' ? 'EN' : '中文'}
          </ArcoButton>
          <span className="user-chip">
            {username.slice(0, 1).toUpperCase()}
          </span>
          <span className="username">{username}</span>
          <ArcoButton
            type="text"
            className="icon-button"
            onClick={logout}
            aria-label={t('auth.logout')}
            title={t('auth.logout')}
            icon={<Icon name="logout" />}
          />
        </header>
        <main className="content">{children}</main>
      </div>
      {palette && (
        <Modal title={t('shell.command')} onClose={() => setPalette(false)}>
          <Input
            className="command-search"
            autoFocus
            prefix={<Icon name="search" />}
            value={query}
            onChange={setQuery}
            placeholder={t('shell.commandPlaceholder')}
          />
          <div className="command-results">
            {results.map((id) => (
              <ArcoButton type="text" key={id} onClick={() => go(id)}>
                <span>{t(`route.${id}`)}</span>
                <Icon name="chevron" />
              </ArcoButton>
            ))}
            {!results.length && (
              <EmptyState message={t('common.noSearchResults')} />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

export function LineChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  if (!data.length)
    return (
      <div className="line-chart chart-empty">
        <EmptyState />
      </div>
    );
  return (
    <div
      className="line-chart"
      role="img"
      aria-label={data.map((item) => `${item.label}: ${item.value}`).join(', ')}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 8, right: 8, left: -22, bottom: 0 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="#28303c"
            strokeDasharray="4 5"
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            minTickGap={28}
            tick={{ fill: '#687487', fontSize: 10 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tick={{ fill: '#687487', fontSize: 10 }}
          />
          <Tooltip
            cursor={{ stroke: '#41506a' }}
            contentStyle={{
              background: '#171b24',
              border: '1px solid #30394a',
              borderRadius: 8,
            }}
            labelStyle={{ color: '#e8edf5' }}
            itemStyle={{ color: '#73baff' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#1890ff"
            strokeWidth={3}
            dot={{ r: 3, fill: '#12151d', stroke: '#73baff', strokeWidth: 2 }}
            activeDot={{ r: 5 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChart({
  data,
  format = String,
}: {
  data: { label: string; value: number }[];
  format?: (value: number) => string;
}) {
  if (!data.length)
    return (
      <div className="bar-chart chart-empty">
        <EmptyState />
      </div>
    );
  return (
    <div
      className="bar-chart"
      style={{ height: Math.max(190, data.length * 46) }}
      role="img"
      aria-label={data
        .map((item) => `${item.label}: ${format(item.value)}`)
        .join(', ')}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 58, left: 0, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={110}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#bcc5d3', fontSize: 11 }}
            tickFormatter={(label) => label || '—'}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,.025)' }}
            contentStyle={{
              background: '#171b24',
              border: '1px solid #30394a',
              borderRadius: 8,
            }}
            labelStyle={{ color: '#e8edf5' }}
            itemStyle={{ color: '#73baff' }}
            formatter={(value: number) => format(Number(value))}
          />
          <Bar dataKey="value" fill="#1890ff" radius={[0, 5, 5, 0]} barSize={8}>
            <LabelList
              dataKey="value"
              position="right"
              fill="#c7cfdb"
              fontSize={11}
              formatter={(value: number) => format(Number(value))}
            />
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
