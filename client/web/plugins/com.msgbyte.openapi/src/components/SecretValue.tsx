import { Icon } from '@capital/component';
import React, { useState } from 'react';
import './SecretValue.less';

export const SecretValue: React.FC<React.PropsWithChildren> = React.memo(
  (props) => {
    const [show, setShow] = useState(false);
    return (
      <span className="plugin-openapi-secret-value">
        {show ? (
          <>
            <span>{props.children}</span>
            <Icon icon="mdi:eye-off-outline" onClick={() => setShow(false)} />
          </>
        ) : (
          <>
            <span>********</span>
            <Icon icon="mdi:eye-outline" onClick={() => setShow(true)} />
          </>
        )}
      </span>
    );
  }
);
SecretValue.displayName = 'SecretValue';
