export interface StrategyType {
  name: string;
  type: 'oauth';
  checkAvailable: () => boolean;
  getUrl: () => string;
  getUserInfo: (code: string) => Promise<{
    id: string;
    nickname: string;
    email: string;
    avatar: string;
  }>;
}
