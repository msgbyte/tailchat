import React from 'react';
import {
  Button,
  Card,
  Message,
  Popconfirm,
  useAsyncRequest,
  useTranslation,
} from 'tushan';
import { request } from '../request';

/**
 * 缓存管理
 */
export const CacheManager: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [, cleanCache] = useAsyncRequest(async () => {
    const { data } = await request.post('/cache/clean');

    if (!data.success) {
      Message.error(t('tushan.common.failed') + ':' + data.msg);
      throw new Error(data.msg);
    }

    Message.success(t('tushan.common.success'));
  });

  return (
    <Card>
      <Popconfirm
        title={t('custom.cache.cleanTitle')}
        content={t('custom.cache.cleanDesc')}
        onOk={cleanCache}
      >
        <Button type="primary" status="danger">
          {t('custom.cache.cleanBtn')}
        </Button>
      </Popconfirm>
    </Card>
  );
});
CacheManager.displayName = 'CacheManager';
