export interface StrategyType {
  name: string;
  checkAvailable: () => boolean;
  getUrl: () => string;
  getUserInfo: (code: string) => Promise<{
    id: string;
    nickname: string;
    email: string;
    avatar: string;
  }>;
}
