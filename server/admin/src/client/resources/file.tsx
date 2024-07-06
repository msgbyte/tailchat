import filesize from 'filesize';
import React, { useState } from 'react';
import {
  createTextField,
  ListTable,
  useAsync,
  useTranslation,
  Typography,
  styled,
  Checkbox,
} from 'tushan';
import { fileFields } from '../fields';
import { request } from '../request';

const Row = styled.div`
  display: flex;
  gap: 20px;
  justify-content: end;
`;

export const FileList: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [isOnlyChatFiles, setIsOnlyChatFiles] = useState(false);
  const { value: totalSize = 0 } = useAsync(async () => {
    const { data } = await request.get('/file/filesizeSum');

    return data.totalSize ?? 0;
  }, []);

  return (
    <>
      <Row>
        <Checkbox
          checked={isOnlyChatFiles}
          onClick={() => {
            setIsOnlyChatFiles(!isOnlyChatFiles);
          }}
        >
          Only show chat files
        </Checkbox>
        <Typography.Paragraph>
          {t('custom.file.fileTotalSize')}: {filesize(totalSize)}
        </Typography.Paragraph>
      </Row>
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
        meta={isOnlyChatFiles ? 'onlyChat' : undefined}
      />
    </>
  );
});
FileList.displayName = 'FileList';
