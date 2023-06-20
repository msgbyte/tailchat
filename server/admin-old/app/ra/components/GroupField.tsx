import React from 'react';
import { ReferenceField, ReferenceFieldProps, TextField } from 'react-admin';

export const GroupField: React.FC<Omit<ReferenceFieldProps, 'reference'>> =
  React.memo((props) => {
    return (
      <ReferenceField link="show" {...props} reference="groups">
        <TextField source="name" />
      </ReferenceField>
    );
  });
GroupField.displayName = 'GroupField';
