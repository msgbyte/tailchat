import React from 'react';
import {
  ReferenceField,
  ReferenceFieldProps,
  TextField,
  useRecordContext,
} from 'react-admin';

const SYSTEM_USERID = '000000000000000000000000';

export const UserField: React.FC<Omit<ReferenceFieldProps, 'reference'>> =
  React.memo((props) => {
    const record = useRecordContext(props);
    if (props.source && record) {
      if (record[props.source] === SYSTEM_USERID) {
        return <div>System</div>;
      }
    }

    return (
      <ReferenceField link="show" {...props} reference="users">
        <>
          <TextField source="nickname" />
          (<TextField source="email" />)
        </>
      </ReferenceField>
    );
  });
UserField.displayName = 'UserField';
