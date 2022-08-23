import { t } from '../index';
/**
 * 休眠一定时间
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, ms)
  );
}

describe('i18n', () => {
  test('should be work', async () => {
    await sleep(2000); // 等待异步加载完毕

    expect(t('Token不合规')).toBe('Token不合规');
    expect(
      t('Token不合规', undefined, {
        lng: 'en-US',
      })
    ).toBe('Token Invalid');
  });
});
