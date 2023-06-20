import { AuthProvider, createAuthProvider } from 'tushan';

export const authStorageKey = 'tailchat:admin:auth';

export const authProvider: AuthProvider = createAuthProvider({
  authStorageKey,
  loginUrl: '/admin/api/login',
});
