import { buildRegFn, buildCachedRegFnAsync } from './buildRegFn';

export const [getErrorHook, setErrorHook] = buildRegFn<(err: any) => boolean>(
  'requestErrorHook',
  () => true
);

export const [tokenGetter, setTokenGetter, refreshTokenGetter] =
  buildCachedRegFnAsync<() => Promise<string>>('requestTokenGetter');
