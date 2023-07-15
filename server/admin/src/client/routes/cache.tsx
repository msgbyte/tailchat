import React from 'react';
import {
  Button,
  Card,
  Message,
  Popconfirm,
  Space,
  useAsyncRequest,
  useTranslation,
} from 'tushan';
import { request } from '../request';

/**
 * 缓存管理
 */
export const CacheManager: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [, cleanCache] = useAsyncRequest(async (target?: string) => {
    const { data } = await request.post('/cache/clean', {
      target,
    });

    if (!data.success) {
      Message.error(t('tushan.common.failed') + ':' + data.msg);
      throw new Error(data.msg);
    }

    Message.success(t('tushan.common.success'));
  });

  return (
    <Card>
      <Space direction="vertical">
        <Popconfirm
          title={t('custom.cache.cleanTitle')}
          content={t('custom.cache.cleanDesc')}
          onOk={() => cleanCache('config.client')}
        >
          <Button type="primary">{t('custom.cache.cleanConfigBtn')}</Button>
        </Popconfirm>

        <Popconfirm
          title={t('custom.cache.cleanTitle')}
          content={t('custom.cache.cleanDesc')}
          onOk={() => cleanCache()}
        >
          <Button type="primary" status="danger">
            {t('custom.cache.cleanAllBtn')}
          </Button>
        </Popconfirm>
      </Space>
    </Card>
  );
});
CacheManager.displayName = 'CacheManager';
