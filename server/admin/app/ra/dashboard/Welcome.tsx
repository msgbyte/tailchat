import React from 'react';
import { Card, Box, Typography, CardActions, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import logoSvg from './logo.svg';

export const Welcome: React.FC = React.memo(() => {
  return (
    <Card
      sx={{
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? '#535353'
            : `linear-gradient(to right, #1a1d26 0%, #232c50 35%)`,

        color: '#fff',
        padding: '20px',
        marginTop: 2,
        marginBottom: '1em',
      }}
    >
      <Box display="flex">
        <Box flex="1">
          <Typography variant="h5" component="h2" gutterBottom>
            欢迎使用 Tailchat 后台管理程序
          </Typography>
          <Box maxWidth="40em">
            <Typography variant="body1" component="p" gutterBottom>
              Tailchat 是一个完全开源的即时通讯应用
            </Typography>
          </Box>
          <CardActions
            sx={{
              padding: { xs: 0, xl: null },
              flexWrap: { xs: 'wrap', xl: null },
              '& a': {
                marginTop: { xs: '1em', xl: null },
                marginLeft: { xs: '0!important', xl: null },
                marginRight: { xs: '1em', xl: null },
              },
            }}
          >
            <Button
              variant="contained"
              href="https://tailchat.msgbyte.com/"
              startIcon={<HomeIcon />}
              target="__blank"
            >
              访问官网
            </Button>
            <Button
              variant="contained"
              href="https://github.com/msgbyte/tailchat"
              startIcon={<CodeIcon />}
              target="__blank"
            >
              浏览源码
            </Button>
          </CardActions>
        </Box>
        <Box
          display={{ xs: 'none', sm: 'none', md: 'block' }}
          sx={{
            marginLeft: 'auto',
            backgroundImage: `url(${logoSvg})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
          width="9em"
          height="9em"
          overflow="hidden"
        />
      </Box>
    </Card>
  );
});
Welcome.displayName = 'Welcome';
