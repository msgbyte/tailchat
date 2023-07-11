export interface StrategyType {
  name: string;
  type: 'oauth';
  icon: string;
  checkAvailable: () => boolean;
  getUrl: () => string;
  getUserInfo: (code: string) => Promise<{
    id: string;
    nickname: string;
    username: string;
    email: string;
    avatar: string;
  }>;
}
