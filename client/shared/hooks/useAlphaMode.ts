import { useStorage } from '../manager/storage';

const alphaModeKey = 'alphaMode';

/**
 * 是否为 alpha 模式
 * 在 alpha 模式下可以看到一些可以被公开但是还在测试中的功能
 */
export function useAlphaMode() {
  const [isAlphaMode, { save: setAlphaMode }] = useStorage<boolean>(
    alphaModeKey,
    false
  );

  return { isAlphaMode, setAlphaMode };
}
