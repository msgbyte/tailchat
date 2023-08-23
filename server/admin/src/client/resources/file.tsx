import React from 'react';
import { createTextField, ListTable } from 'tushan';
import { fileFields } from '../fields';

export const FileList: React.FC = React.memo(() => {
  return (
    <ListTable
      filter={[
        createTextField('q', {
          label: 'Search',
        }),
      ]}
      fields={fileFields}
      action={{ detail: true, delete: true }}
      batchAction={{ delete: true }}
    />
  );
});
FileList.displayName = 'FileList';
