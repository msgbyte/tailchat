import React, { useState } from 'react';
import { Icon } from '../Icon';

interface SensitiveTextProps {
  text: string;
}
export const SensitiveText: React.FC<SensitiveTextProps> = React.memo(
  (props) => {
    const { text } = props;
    const [show, setShow] = useState(false);

    return (
      <span>
        {show ? text : getMaskedText(text)}

        <Icon
          style={{ cursor: 'pointer', marginLeft: 4 }}
          icon={show ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
          onClick={() => setShow((before) => !before)}
        />
      </span>
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
