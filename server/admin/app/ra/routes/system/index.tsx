import React, { PropsWithChildren } from 'react';
import { request } from '../../request';
import { useRequest } from 'ahooks';
import { CircularProgress, Box, Grid, Input, Button } from '@mui/material';
import { useTranslate, useNotify } from 'react-admin';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { useEditValue } from '../../utils/hooks';
import { Image } from '../../components/Image';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';

const SystemItem: React.FC<
  PropsWithChildren<{
    label: string;
  }>
> = React.memo((props) => {
  return (
    <Grid container spacing={2} marginBottom={2}>
      <Grid item xs={4}>
        {props.label}:
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
    refresh,
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
        refresh();
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

  const {
    loading: loadingServerEntryImage,
    run: handleChangeServerEntryImage,
  } = useRequest(
    async (file: File | null) => {
      try {
        if (file) {
          const formdata = new FormData();
          formdata.append('file', file);

          const { data } = await request.put('/file/upload', formdata, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          const fileInfo = data.files[0];

          if (!fileInfo) {
            throw new Error('not get file');
          }

          const url = fileInfo.url;
          await request.patch('/config/client', {
            key: 'serverEntryImage',
            value: url,
          });
          refresh();
        } else {
          // delete
          await request.patch('/config/client', {
            key: 'serverEntryImage',
            value: '',
          });
          refresh();
        }

        notify('custom.common.operateSuccess', {
          type: 'info',
        });
      } catch (err) {
        console.log(err);
        notify('custom.common.operateFailed', {
          type: 'info',
        });
      }
    },
    {
      manual: true,
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

      <SystemItem label={translate('custom.config.serverEntryImage')}>
        <div>
          <LoadingButton
            loading={loadingServerEntryImage}
            variant="contained"
            component="label"
          >
            {translate('custom.common.upload')}
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleChangeServerEntryImage(file);
                }
              }}
            />
          </LoadingButton>

          {config?.serverEntryImage && (
            <div style={{ marginTop: 10 }}>
              <div>
                <Image
                  style={{ maxWidth: '100%', maxHeight: 360 }}
                  src={config?.serverEntryImage}
                />
              </div>

              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => handleChangeServerEntryImage(null)}
              >
                {translate('custom.common.delete')}
              </Button>
            </div>
          )}
        </div>
      </SystemItem>
    </Box>
  );
});
SystemConfig.displayName = 'SystemConfig';
