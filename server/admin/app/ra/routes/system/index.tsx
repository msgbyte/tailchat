import React from 'react';
import { request } from '../../request';
import { useRequest } from 'ahooks';
import { CircularProgress, Box, Grid } from '@mui/material';
import _uniq from 'lodash/uniq';
import { BooleanField, useTranslate } from 'react-admin';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';

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
      <Grid container spacing={2}>
        <Grid item xs={4}>
          {translate('custom.config.uploadFileLimit')}
        </Grid>
        <Grid item xs={8}>
          {config.uploadFileLimit}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          {translate('custom.config.emailVerification')}
        </Grid>
        <Grid item xs={8}>
          {config.emailVerification ? (
            <DoneIcon fontSize="small" />
          ) : (
            <ClearIcon fontSize="small" />
          )}
        </Grid>
      </Grid>
    </Box>
  );
});
SystemConfig.displayName = 'SystemConfig';
