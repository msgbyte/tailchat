import React from 'react';
import filesize from 'filesize';
import {
  NumberFieldProps,
  sanitizeFieldRestProps,
  useRecordContext,
  useTranslate,
} from 'react-admin';
import get from 'lodash/get';
import { Typography } from '@mui/material';

export const FilesizeField: React.FC<NumberFieldProps> = React.memo((props) => {
  const { className, emptyText, source, locales, options, textAlign, ...rest } =
    props;
  const record = useRecordContext(props);
  const translate = useTranslate();

  if (!record) {
    return null;
  }
  const value = get(record, source!);

  if (value == null) {
    return emptyText ? (
      <Typography
        component="span"
        variant="body2"
        className={className}
        {...sanitizeFieldRestProps(rest)}
      >
        {emptyText && translate(emptyText, { _: emptyText })}
      </Typography>
    ) : null;
  }

  return (
    <Typography
      component="span"
      variant="body2"
      className={className}
      {...sanitizeFieldRestProps(rest)}
    >
      {filesize(value)}
    </Typography>
  );
});
FilesizeField.displayName = 'FilesizeField';
