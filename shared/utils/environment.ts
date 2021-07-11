export const isBrowser = typeof window !== 'undefined';

export const isNavigator = typeof navigator !== 'undefined';

export const isDevelopment = process.env.NODE_ENV === 'development';
