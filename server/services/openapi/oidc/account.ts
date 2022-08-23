import { User } from './model';

export async function claimUserInfo(userId: string) {
  const baseUserInfo = await User.getUserBaseInfo(userId);

  return {
    ...baseUserInfo,
    sub: userId,
  };
}
