import React from 'react';
import filesize from 'filesize';
import { createFieldFactory, FieldDetailComponent } from 'tushan';

export const FileSizeFieldDetail: FieldDetailComponent = React.memo((props) => {
  return <span>{filesize(Number(props.value))}</span>;
});
FileSizeFieldDetail.displayName = 'FileSizeFieldDetail';

export const createFileSizeField = createFieldFactory({
  detail: FileSizeFieldDetail,
  edit: FileSizeFieldDetail,
});
