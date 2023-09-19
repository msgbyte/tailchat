import filesize from 'filesize';
import React from 'react';
import {
  createTextField,
  ListTable,
  useAsync,
  useTranslation,
  Typography,
} from 'tushan';
import { fileFields } from '../fields';
import { request } from '../request';

export const FileList: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { value: totalSize = 0 } = useAsync(async () => {
    const { data } = await request.get('/file/filesizeSum');

    return data.totalSize ?? 0;
  }, []);

  return (
    <>
      <Typography.Paragraph style={{ textAlign: 'right' }}>
        {t('custom.file.fileTotalSize')}: {filesize(totalSize)}
      </Typography.Paragraph>
      <ListTable
        filter={[
          createTextField('q', {
            label: 'Search',
          }),
        ]}
        fields={fileFields}
        action={{ detail: true, delete: true }}
        batchAction={{ delete: true }}
        showSizeChanger={true}
      />
    </>
  );
});
FileList.displayName = 'FileList';
