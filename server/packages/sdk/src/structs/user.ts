const userType = ['normalUser', 'pluginBot', 'openapiBot'];
type UserType = typeof userType[number];

export interface UserStruct {
  /**
   * 用户名 不可被修改
   * 与email必有一个
   */
  username?: string;

  /**
   * 邮箱 不可被修改
   * 必填
   */
  email: string;

  password: string;

  /**
   * 可以被修改的显示名
   */
  nickname: string;

  /**
   * 识别器, 跟username构成全局唯一的用户名
   * 用于搜索
   * <username>#<discriminator>
   */
  discriminator: string;

  /**
   * 是否为临时用户
   * @default false
   */
  temporary: boolean;

  /**
   * 头像
   */
  avatar?: string;

  type: UserType[];

  emailVerified: boolean;
}
