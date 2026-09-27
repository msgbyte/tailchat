import { queryClient } from 'tailchat-shared/cache';
import { CacheKey, getCachedUserInfo } from 'tailchat-shared/cache/cache';
import { fetchUserInfo, UserBaseInfo } from 'tailchat-shared/model/user';

let mockViewerId: string | undefined;
jest.mock('tailchat-shared/redux/store', () => ({
  getReduxStore: () => ({
    getState: () => ({ user: { info: { _id: mockViewerId } } }),
  }),
}));
jest.mock('tailchat-shared/model/user', () => ({
  ...jest.requireActual('tailchat-shared/model/user'),
  fetchUserInfo: jest.fn(),
}));

const alice: UserBaseInfo = {
  _id: '507f1f77bcf86cd799439011',
  email: 'alice@example.invalid',
  nickname: 'Alice',
  discriminator: '0001',
  avatar: null,
  temporary: false,
  type: 'normalUser',
  emailVerified: false,
  banned: false,
};
const fetchProfile = fetchUserInfo as jest.MockedFunction<typeof fetchUserInfo>;

beforeEach(() => {
  queryClient.clear();
  fetchProfile.mockReset();
  mockViewerId = alice._id;
});
afterEach(() => queryClient.clear());

test('cached profiles are isolated when switching accounts or browsing anonymously', async () => {
  fetchProfile.mockImplementation(async () => {
    const { email, ...publicProfile } = alice;
    return mockViewerId === alice._id ? alice : publicProfile;
  });

  for (const viewerId of [alice._id, 'bob', undefined, alice._id]) {
    mockViewerId = viewerId;
    const profile = await getCachedUserInfo(alice._id);
    if (viewerId === alice._id) {
      expect(profile).toHaveProperty('email', alice.email);
    } else {
      expect(profile).not.toHaveProperty('email');
    }
  }
  expect(fetchProfile).toHaveBeenCalledTimes(3);
});

test('legacy persisted profiles cannot expose email to another account', async () => {
  queryClient.setQueryData([CacheKey.user, alice._id], alice);
  mockViewerId = 'bob';
  const { email, ...publicProfile } = alice;
  fetchProfile.mockResolvedValue(publicProfile);

  expect(await getCachedUserInfo(alice._id)).not.toHaveProperty('email');
  expect(fetchProfile).toHaveBeenCalledTimes(1);
});

test('an in-flight profile request cannot expose email after identity changes', async () => {
  let resolve!: (profile: UserBaseInfo) => void;
  fetchProfile.mockReturnValue(
    new Promise((done) => {
      resolve = done;
    })
  );
  const profile = getCachedUserInfo(alice._id);
  mockViewerId = 'bob';
  resolve(alice);
  expect(await profile).not.toHaveProperty('email');
});
