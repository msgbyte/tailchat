import React from 'react';
import { Button, Card, Typography, useTranslation } from 'tushan';

/**
 * SocketIO 管理
 */
export const SocketIOAdmin: React.FC = React.memo(() => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const { t } = useTranslation();

  return (
    <Card>
      <div>
        <Typography.Paragraph>
          {t('custom.socketio.tip1')}{' '}
          <strong>
            {protocol}://{window.location.host}
          </strong>
        </Typography.Paragraph>
        <Typography.Paragraph>{t('custom.socketio.tip2')}</Typography.Paragraph>
        <Typography.Paragraph>{t('custom.socketio.tip3')}</Typography.Paragraph>
      </div>

      <Button
        type="primary"
        onClick={() => {
          window.open('https://admin.socket.io/');
        }}
      >
        {t('custom.socketio.btn')}
      </Button>
    </Card>
  );
});
SocketIOAdmin.displayName = 'SocketIOAdmin';
