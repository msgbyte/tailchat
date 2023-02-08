type TailchatTypeMap = NonNullable<typeof window.tailchat>;

/**
 * 注入tailchat全局变量到window
 */
export function injectTailchatGlobalValue<T extends keyof TailchatTypeMap>(
  key: T,
  value: TailchatTypeMap[T]
) {
  if (!window.tailchat) {
    window.tailchat = {};
  }

  window.tailchat[key] = value;
}
