export interface UserBaseInfo {
  _id: string;
  email: string;
  nickname: string;
  discriminator: string;
  avatar: string | null;
  temporary: boolean;
  emailVerified: boolean;
  extra?: Record<string, unknown>;
}
