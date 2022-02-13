import React, { useState } from 'react';
import { Icon as Iconify, IconProps } from '@iconify/react';

export const Icon: React.FC<Omit<IconProps, 'ref'>> = React.memo((props) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Iconify {...props} onLoad={() => setLoaded(true)} />
      {!loaded && <span style={{ width: '1em', height: '1em' }} />}
    </>
  );
});
Icon.displayName = 'Icon';
