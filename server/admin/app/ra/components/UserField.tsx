import React from 'react';
import { ReferenceField, ReferenceFieldProps, TextField } from 'react-admin';

export const UserField: React.FC<Omit<ReferenceFieldProps, 'reference'>> =
  React.memo((props) => {
    return (
      <ReferenceField link="show" {...props} reference="users">
        <TextField source="nickname" />
      </ReferenceField>
    );
  });
UserField.displayName = 'UserField';
