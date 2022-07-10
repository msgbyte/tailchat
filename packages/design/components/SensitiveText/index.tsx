import React, { useState } from 'react';
import { Icon } from '../Icon';

interface SensitiveTextProps {
  className?: string;
  text: string;
}
export const SensitiveText: React.FC<SensitiveTextProps> = React.memo(
  (props) => {
    const { className, text } = props;
    const [show, setShow] = useState(false);

    return (
      <div
        className={className}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {show ? text : getMaskedText(text)}

        <Icon
          style={{ cursor: 'pointer', marginLeft: 4 }}
          icon={show ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
          onClick={() => setShow((before) => !before)}
        />
      </div>
    );
  }
);
SensitiveText.displayName = 'SensitiveText';

function getMaskedText(text: string) {
  const len = text.length;
  if (len > 2) {
    return `${text[0]}****${text[len - 1]}`;
  } else if (len === 2) {
    return `${text[0]}*`;
  } else {
    return '**';
  }
}
