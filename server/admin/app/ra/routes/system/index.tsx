import React, { PropsWithChildren } from 'react';
import { request } from '../../request';
import { useRequest } from 'ahooks';
import { CircularProgress, Box, Grid } from '@mui/material';
import { useTranslate } from 'react-admin';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';

const SystemItem: React.FC<
  PropsWithChildren<{
    label: string;
  }>
> = React.memo((props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        {props.label}
      </Grid>
      <Grid item xs={8}>
        {props.children}
      </Grid>
    </Grid>
  );
});
SystemItem.displayName = 'SystemItem';

/**
 * Tailchat 系统设置
 */
export const SystemConfig: React.FC = React.memo(() => {
  const translate = useTranslate();
  const { data: config, loading } = useRequest(async () => {
    const { data } = await request('/config/client');

    return data.config ?? {};
  });

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box
      sx={{
        paddingTop: 2,
        paddingBottom: 2,
        maxWidth: '100vw',
      }}
    >
      <SystemItem label={translate('custom.config.uploadFileLimit')}>
        {config.uploadFileLimit}
      </SystemItem>

      <SystemItem label={translate('custom.config.emailVerification')}>
        {config.emailVerification ? (
          <DoneIcon fontSize="small" />
        ) : (
          <ClearIcon fontSize="small" />
        )}
      </SystemItem>
    </Box>
  );
});
SystemConfig.displayName = 'SystemConfig';
