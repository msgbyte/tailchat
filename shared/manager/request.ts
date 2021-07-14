import { buildRegFn, buildCachedRegFnAsync } from './buildRegFn';

export const [getErrorHook, setErrorHook] = buildRegFn<(err: any) => boolean>(
  'requestErrorHook',
  () => true
);

export const [tokenGetter, setTokenGetter] =
  buildCachedRegFnAsync<() => Promise<string>>('requestTokenGetter');
