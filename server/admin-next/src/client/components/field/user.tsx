import React from 'react';
import {
  createFieldFactory,
  FieldDetailComponent,
  ReferenceFieldDetail,
  ReferenceFieldOptions,
} from 'tushan';

const SYSTEM_USERID = '000000000000000000000000';

export const UserFieldDetail: FieldDetailComponent = React.memo((props) => {
  if (props.value === SYSTEM_USERID) {
    return <div>System</div>;
  }

  return <ReferenceFieldDetail {...props} />;
});
UserFieldDetail.displayName = 'UserFieldDetail';

export const createUserField = createFieldFactory<ReferenceFieldOptions>({
  detail: UserFieldDetail,
  edit: UserFieldDetail,
});
