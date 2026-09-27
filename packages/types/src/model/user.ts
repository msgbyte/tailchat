export const userType = ['normalUser', 'pluginBot', 'openapiBot'] as const;
export type UserType = (typeof userType)[number];

export interface UserBaseInfo {
  _id: string;
  /**
   * Username cannot modify
   *
   * There must be one with email
   */
  username?: string;

  /**
   * E-mail cannot be modified
   * Only included when the authenticated user queries their own profile.
   */
  email?: string;
  /**
   * display name that can be modified
   */
  nickname: string;
  /**
   * Identifier, together with username constitutes a globally unique username
   * use for search
   * <username>#<discriminator>
   */
  discriminator: string;
  avatar: string | null;
  /**
   * Is it a temporary user
   * @default false
   */
  temporary: boolean;
  type: UserType;
  emailVerified: boolean;
  banned: boolean;
  extra?: Record<string, unknown>;
}

export interface UserInfoWithPassword extends UserBaseInfo {
  password: string;
}

export interface UserInfoWithToken extends UserBaseInfo {
  email: string;
  token: string;
}
