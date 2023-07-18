import React from 'react';
import {
  Button,
  Input,
  Form,
  useTranslation,
  Typography,
  Card,
  Radio,
  ReferenceFieldEdit,
  useAsyncRequest,
  Tooltip,
  Message,
} from 'tushan';
import { IconExclamationCircle } from 'tushan/icon';
import { MarkdownEditor } from '../../components/MarkdownEditor';
import { request } from '../../request';

/**
 * Tailchat 系统通知
 *
 * 发送markdown格式的消息到指定用户的收件箱
 */
export const SystemNotify: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const scope: 'all' | 'specified' = Form.useWatch('scope', form);

  const [{ loading }, handleSubmit] = useAsyncRequest(async (values) => {
    const { data } = await request.post('/users/system/notify', {
      scope: values.scope,
      specifiedUser: values.specifiedUser,
      title: values.title,
      content: values.content,
    });

    Message.success(
      t('custom.system-notify.notifySuccess', { count: data.userIds.length })
    );
  });

  return (
    <Card>
      <Typography.Title heading={3} style={{ textAlign: 'center' }}>
        {t('custom.system-notify.create')}
      </Typography.Title>
      <Typography.Title
        heading={6}
        style={{ textAlign: 'center', color: '#666' }}
      >
        {t('custom.system-notify.tip')}
      </Typography.Title>

      <Form form={form} onSubmit={handleSubmit}>
        <Form.Item label={t('custom.system-notify.title')} field="title">
          <Input name="title" />
        </Form.Item>

        <Form.Item
          label={t('custom.system-notify.content')}
          field="content"
          rules={[{ required: true }]}
        >
          <MarkdownFormInput />
        </Form.Item>

        <Form.Item
          label={t('custom.system-notify.scope')}
          field="scope"
          rules={[{ required: true }]}
          initialValue="all"
        >
          <Radio.Group>
            <Radio value="all">
              {t('custom.system-notify.allUser')}

              <Tooltip content={t('custom.system-notify.allUserTip')}>
                <IconExclamationCircle
                  style={{ margin: '0 8px', color: 'rgb(var(--arcoblue-6))' }}
                />
              </Tooltip>
            </Radio>
            <Radio value="specified">
              {t('custom.system-notify.specifiedUser')}
            </Radio>
          </Radio.Group>
        </Form.Item>

        {scope === 'specified' && (
          <Form.Item
            label={t('custom.system-notify.specifiedUser')}
            field="specifiedUser"
          >
            <UserSelectedFormInput />
          </Form.Item>
        )}

        <Form.Item label={' '}>
          <Button htmlType="submit" loading={loading}>
            {t('tushan.common.submit')}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
});
SystemNotify.displayName = 'SystemNotify';

export const MarkdownFormInput: React.FC<{
  value?: string;
  onChange?: (val: string) => void;
}> = React.memo((props) => {
  const value = props.value || '';

  const handleChange = (newValue) => {
    props.onChange && props.onChange(newValue);
  };

  return <MarkdownEditor value={value} onChange={handleChange} />;
});
MarkdownFormInput.displayName = 'MarkdownFormInput';

export const UserSelectedFormInput: React.FC<{
  value?: string;
  onChange?: (val: string) => void;
}> = React.memo((props) => {
  const value = props.value || '';

  const handleChange = (newValue) => {
    props.onChange && props.onChange(newValue);
  };

  /**
   * Wait for ReferenceMany
   */
  return (
    <ReferenceFieldEdit
      value={value}
      onChange={handleChange}
      options={{
        reference: 'users',
        displayField: 'nickname',
      }}
    />
  );
});
UserSelectedFormInput.displayName = 'UserSelectedFormInput';
