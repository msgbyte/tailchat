import { buildRegFn, buildCachedRegFn } from './buildRegFn';

export const [getErrorHook, setErrorHook] = buildRegFn<(err: any) => boolean>(
  'requestErrorHook',
  () => true
);

export const [tokenGetter, setTokenGetter] =
  buildCachedRegFn<() => Promise<string>>('requestTokenGetter');
