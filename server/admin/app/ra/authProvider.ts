import { AuthProvider } from 'react-admin';

export const authStorageKey = 'tailchat:admin:auth';

export const authProvider: AuthProvider = {
  login: ({ username, password }) => {
    const request = new Request('/admin/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return fetch(request)
      .then((response) => {
        return response.json();
      })
      .then((auth) => {
        localStorage.setItem(authStorageKey, JSON.stringify(auth));
      })
      .catch(() => {
        throw new Error('登录失败');
      });
  },
  logout: () => {
    localStorage.removeItem(authStorageKey);
    return Promise.resolve();
  },
  checkAuth: () =>
    localStorage.getItem(authStorageKey) ? Promise.resolve() : Promise.reject(),
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem(authStorageKey);
      return Promise.reject();
    }

    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },
  getIdentity: () => {
    const { username } = JSON.parse(
      localStorage.getItem(authStorageKey) ?? '{}'
    );
    if (!username) {
      return Promise.reject();
    }

    return Promise.resolve({
      id: username,
      fullName: username,
    });
  },
  getPermissions: () => Promise.resolve(''),
};
