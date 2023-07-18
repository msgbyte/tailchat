import React, { useEffect } from 'react';
import { request } from '../../request';
import {
  useAsyncRequest,
  useEditValue,
  Button,
  Input,
  Spin,
  Message,
  Form,
  Upload,
  useTranslation,
  Card,
  Tabs,
  Switch,
} from 'tushan';
import _get from 'lodash/get';
import { IconCheck, IconClose, IconDelete } from 'tushan/icon';
import { TailchatImage } from '../../components/TailchatImage';

/**
 * Tailchat 系统设置
 */
export const SystemConfig: React.FC = React.memo(() => {
  const [{ value: config = {}, loading, error }, fetchConfig] = useAsyncRequest(
    async () => {
      const { data } = await request.get('/config/client');

      return data.config ?? {};
    }
  );
  const { t } = useTranslation();

  useEffect(() => {
    fetchConfig();
  }, []);

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
        fetchConfig();
        Message.success(t('tushan.common.success'));
      } catch (err) {
        console.log(err);
        Message.error(String(err));
      }
    }
  );

  const [{}, handleChangeServerEntryImage] = useAsyncRequest(
    async (file: File | null) => {
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
        fetchConfig();
      } else {
        // delete
        await request.patch('/config/client', {
          key: 'serverEntryImage',
          value: '',
        });
        fetchConfig();
      }
    }
  );

  const [{}, handleChangeAnnouncement] = useAsyncRequest(
    async (values: { enable: boolean; link: string; text: string }) => {
      console.log(values);
      const { enable = false, link = '', text = '' } = values;

      if (enable) {
        await request.patch('/config/client', {
          key: 'announcement',
          value: {
            id: Date.now(),
            text,
            link,
          },
        });
      } else {
        await request.patch('/config/client', {
          key: 'announcement',
          value: false,
        });
      }

      Message.success(t('tushan.common.success'));
    }
  );

  if (loading) {
    return <Spin />;
  }

  if (error) {
    console.log('error', error);
    return <div>{String(error)}</div>;
  }

  return (
    <Card>
      <Tabs>
        <Tabs.TabPane key={0} title={t('custom.config.configPanel')}>
          <Form>
            <Form.Item label={t('custom.config.uploadFileLimit')}>
              {config.uploadFileLimit}
            </Form.Item>

            <Form.Item label={t('custom.config.emailVerification')}>
              {config.emailVerification ? <IconCheck /> : <IconClose />}
            </Form.Item>

            <Form.Item label={t('custom.config.allowGuestLogin')}>
              {!config.disableGuestLogin ? <IconCheck /> : <IconClose />}
            </Form.Item>

            <Form.Item label={t('custom.config.allowUserRegister')}>
              {!config.disableUserRegister ? <IconCheck /> : <IconClose />}
            </Form.Item>

            <Form.Item label={t('custom.config.allowCreateGroup')}>
              {!config.disableCreateGroup ? <IconCheck /> : <IconClose />}
            </Form.Item>

            <Form.Item label={t('custom.config.serverName')}>
              <Input
                value={serverName}
                onChange={(val) => setServerName(val)}
                onBlur={() => saveServerName()}
                placeholder="Tailchat"
              />
            </Form.Item>

            <Form.Item label={t('custom.config.serverEntryImage')}>
              <div>
                {config?.serverEntryImage ? (
                  <div style={{ marginTop: 10 }}>
                    <div>
                      <TailchatImage
                        style={{
                          maxWidth: '100%',
                          maxHeight: 360,
                          overflow: 'hidden',
                          marginBottom: 4,
                        }}
                        src={config?.serverEntryImage}
                      />
                    </div>

                    <Button
                      type="primary"
                      icon={<IconDelete />}
                      onClick={() => handleChangeServerEntryImage(null)}
                    >
                      Delete
                    </Button>
                  </div>
                ) : (
                  <Upload
                    onChange={(_, file) => {
                      handleChangeServerEntryImage(file.originFile);
                    }}
                  />
                )}
              </div>
            </Form.Item>
          </Form>
        </Tabs.TabPane>

        <Tabs.TabPane key={1} title={t('custom.config.announcementPanel')}>
          <Form
            initialValues={
              config['announcement']
                ? {
                    enable: true,
                    text: _get(config, ['announcement', 'text'], ''),
                    link: _get(config, ['announcement', 'link'], ''),
                  }
                : { enable: false, text: '', link: '' }
            }
            onSubmit={handleChangeAnnouncement}
          >
            <Form.Item
              label={t('custom.config.announcementEnable')}
              field="enable"
            >
              <SwitchFormInput />
            </Form.Item>
            <Form.Item label={t('custom.config.announcementText')} field="text">
              <Input maxLength={240} />
            </Form.Item>
            <Form.Item
              label={t('custom.config.announcementLink')}
              field="link"
              tooltip={t('custom.config.announcementLinkTip')}
            >
              <Input placeholder="https://tailchat.msgbyte.com/" />
            </Form.Item>
            <Form.Item label={' '}>
              <Button htmlType="submit">{t('tushan.common.submit')}</Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
});
SystemConfig.displayName = 'SystemConfig';

export const SwitchFormInput: React.FC<{
  value?: boolean;
  onChange?: (val: boolean) => void;
}> = React.memo((props) => {
  return <Switch checked={props.value} onChange={props.onChange} />;
});
SwitchFormInput.displayName = 'SwitchFormInput';
