import { request } from '../api/request';
import { buildCachedRequest } from '../cache/utils';

/**
 * 获取可用的微服务列表
 */
export const fetchAvailableServices = buildCachedRequest(
  'fetchAvailableServices',
  async (): Promise<string[]> => {
    const { data } = await request.get<{
      nodeID: string;
      cpu: unknown;
      memory: unknown;
      services: string[];
    }>('/api/gateway/health');

    return data.services;
  }
);
