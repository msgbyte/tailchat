import React, { useState } from 'react';
import {
  Icon as Iconify,
  IconProps,
  addIcon,
  addCollection,
} from '@iconify/react';

const placeHolderStyle = { width: '1em', height: '1em' };

const InternalIcon: React.FC<Omit<IconProps, 'ref'>> = React.memo((props) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Iconify {...props} onLoad={() => setLoaded(true)} />
      {!loaded && <span style={placeHolderStyle} />}
    </>
  );
});
InternalIcon.displayName = 'Icon';

type CompoundedComponent = React.FC<Omit<IconProps, 'ref'>> & {
  addIcon: typeof addIcon;
  addCollection: typeof addCollection;
};

export const Icon = InternalIcon as CompoundedComponent;

Icon.addIcon = addIcon;
Icon.addCollection = addCollection;
