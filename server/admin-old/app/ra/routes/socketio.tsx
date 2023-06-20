import React from 'react';
import { useTranslate } from 'react-admin';
import { Typography, CardActions, Button, Box } from '@mui/material';
import { Card, CardContent } from '@mui/material';

/**
 * SocketIO 管理
 */
export const SocketIOAdmin: React.FC = React.memo(() => {
  const translate = useTranslate();
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

  return (
    <Box p={4}>
      <Card>
        <CardContent>
          <Typography component="div">
            {translate('custom.socketio.tip1')}{' '}
            <strong>
              {protocol}://{window.location.host}
            </strong>
          </Typography>
          <Typography component="div">
            {translate('custom.socketio.tip2')}
          </Typography>
          <Typography component="div">
            {translate('custom.socketio.tip3')}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            onClick={() => {
              window.open('https://admin.socket.io/');
            }}
          >
            {translate('custom.socketio.btn')}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
});
SocketIOAdmin.displayName = 'SocketIOAdmin';
