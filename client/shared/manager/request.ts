import { buildRegFn, buildCachedRegFnAsync } from './buildReg';

export const [getErrorHook, setErrorHook] = buildRegFn<(err: any) => boolean>(
  'requestErrorHook',
  () => true
);

export const [tokenGetter, setTokenGetter, refreshTokenGetter] =
  buildCachedRegFnAsync<() => Promise<string>>('requestTokenGetter');
