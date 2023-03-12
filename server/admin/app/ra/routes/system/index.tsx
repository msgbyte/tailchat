import React, { PropsWithChildren } from 'react';
import { request } from '../../request';
import { useRequest } from 'ahooks';
import { CircularProgress, Box, Grid, Input } from '@mui/material';
import { useTranslate, useDelete, useNotify } from 'react-admin';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { useEditValue } from '../../utils/hooks';

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
  const notify = useNotify();
  const {
    data: config,
    loading,
    error,
  } = useRequest(async () => {
    const { data } = await request.get('/config/client');

    return data.config ?? {};
  });

  const [serverName, setServerName, saveServerName] = useEditValue(
    config?.serverName,
    async (val) => {
      if (val === config?.serverName) {
        return;
      }

      try {
        await request.patch('/config/client', {
          key: 'serverName',
          value: val,
        });
        notify('custom.common.operateSuccess', {
          type: 'info',
        });
      } catch (err) {
        notify('custom.common.operateFailed', {
          type: 'info',
        });
      }
    }
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>{translate('custom.common.errorOccurred')}</div>;
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

      <SystemItem label={translate('custom.config.serverName')}>
        <Input
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          onBlur={() => saveServerName()}
          placeholder="Tailchat"
        />
      </SystemItem>
    </Box>
  );
});
SystemConfig.displayName = 'SystemConfig';
