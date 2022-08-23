import { fetchLinkPreview } from '../fetchLinkPreview';

const mockGetLinkPreviewFn = jest.fn();
jest.mock('link-preview-js', () => ({
  getLinkPreview: async () => {
    mockGetLinkPreviewFn();
  },
}));

describe('Test "fetchLinkPreview"', () => {
  test(
    'fetchLinkPreview should merge same request',
    async () => {
      await Promise.all([
        fetchLinkPreview('foo'),
        fetchLinkPreview('foo'),
        fetchLinkPreview('foo'),
        fetchLinkPreview('foo'),
        fetchLinkPreview('foo'),
        fetchLinkPreview('foo'),
        fetchLinkPreview('foo'),
        fetchLinkPreview('foo'),
      ]);

      expect(mockGetLinkPreviewFn.mock.calls.length).toBe(1);

      await sleep(5 * 1000); // 度过窗口期

      await Promise.all([
        fetchLinkPreview('foo'),
        fetchLinkPreview('foo'),
        fetchLinkPreview('foo'),
        fetchLinkPreview('foo'),
        fetchLinkPreview('foo'),
        fetchLinkPreview('foo'),
        fetchLinkPreview('foo'),
        fetchLinkPreview('foo'),
      ]);

      expect(mockGetLinkPreviewFn.mock.calls.length).toBe(2);
    },
    10 * 1000
  );
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, ms)
  );
}
