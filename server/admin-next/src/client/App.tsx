import React, { useEffect, useState } from 'react';
import { Alert, Input } from '@arco-design/web-react';
import { useAuth } from './auth';
import { AppShell, Button } from './components';
import { normalizeRoute, type RouteId } from './core';
import { Icon } from './icons';
import { useI18n } from './i18n';
import { DashboardPage, specialPages } from './pages';
import { ResourcePage } from './resources';

const resourceRoutes = new Set<RouteId>([
  'users',
  'login-logs',
  'messages',
  'groups',
  'files',
  'mail',
  'discover',
  'audit-logs',
]);

export default function App() {
  const { session, logout } = useAuth();
  const [route, setRoute] = useState<RouteId>(() =>
    normalizeRoute(window.location.pathname)
  );
  useEffect(() => {
    const sync = () => setRoute(normalizeRoute(window.location.pathname));
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  useEffect(() => {
    document.title = `Tailchat Admin · ${route}`;
  }, [route]);
  if (!session) return <LoginPage />;
  const navigate = (next: RouteId) => {
    window.history.pushState({}, '', `/admin-next/${next}`);
    setRoute(next);
  };
  let page: React.ReactNode;
  if (route === 'dashboard')
    page = <DashboardPage username={session.username} />;
  else if (resourceRoutes.has(route))
    page = <ResourcePage route={route as 'users'} />;
  else {
    const Page = specialPages[route];
    page = Page ? <Page /> : null;
  }
  return (
    <AppShell
      route={route}
      username={session.username}
      navigate={navigate}
      logout={logout}
    >
      {page}
    </AppShell>
  );
}

function LoginPage() {
  const { login } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
    } catch {
      setError(t('auth.failed'));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-page">
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />
      <Button
        className="language-switch"
        variant="ghost"
        onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
        icon="language"
      >
        {language === 'zh' ? 'English' : '中文'}
      </Button>
      <main className="login-panel">
        <div className="login-brand">
          <img src="/admin-next/tailchat-logo.svg" alt="Tailchat" />
          <span>{t('app.edition')}</span>
        </div>
        <div className="login-heading">
          <span className="eyebrow">{t('app.console')}</span>
          <h1>{t('auth.signIn')}</h1>
          <p>{t('auth.subtitle')}</p>
        </div>
        <form onSubmit={submit}>
          <label>
            <span>{t('auth.username')}</span>
            <Input
              autoFocus
              autoComplete="username"
              value={username}
              onChange={setUsername}
              required
            />
          </label>
          <label>
            <span>{t('auth.password')}</span>
            <Input.Password
              autoComplete="current-password"
              value={password}
              onChange={setPassword}
              required
            />
          </label>
          {error && <Alert type="error" content={error} />}
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? t('auth.signingIn') : t('auth.signIn')}
            <Icon name="chevron" />
          </Button>
        </form>
        <footer>{t('app.footer')}</footer>
      </main>
    </div>
  );
}
