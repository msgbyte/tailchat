import React from 'react';
import { Typography, CardActions, Button, Box } from '@mui/material';
import { Card, CardContent } from '@mui/material';

/**
 * SocketIO 管理
 */
export const SocketIOAdmin: React.FC = React.memo(() => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

  return (
    <Box p={4}>
      <Card>
        <CardContent>
          <Typography component="div">
            服务器URL为:{' '}
            <strong>
              {protocol}://{window.location.host}
            </strong>
          </Typography>
          <Typography component="div">
            账号密码为Tailchat后台的账号密码
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            onClick={() => {
              window.open('https://admin.socket.io/');
            }}
          >
            打开管理平台
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
});
SocketIOAdmin.displayName = 'SocketIOAdmin';
