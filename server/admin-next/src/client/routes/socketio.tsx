import React from 'react';
import { Button, Card, Typography } from 'tushan';

/**
 * SocketIO 管理
 */
export const SocketIOAdmin: React.FC = React.memo(() => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

  return (
    <Card>
      <div>
        <Typography.Paragraph>
          {'custom.socketio.tip1'}{' '}
          <strong>
            {protocol}://{window.location.host}
          </strong>
        </Typography.Paragraph>
        <Typography.Paragraph>{'custom.socketio.tip2'}</Typography.Paragraph>
        <Typography.Paragraph>{'custom.socketio.tip3'}</Typography.Paragraph>
      </div>

      <Button
        type="primary"
        onClick={() => {
          window.open('https://admin.socket.io/');
        }}
      >
        {'custom.socketio.btn'}
      </Button>
    </Card>
  );
});
SocketIOAdmin.displayName = 'SocketIOAdmin';
