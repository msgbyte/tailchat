import React from 'react';
import { parseUrlStr } from '../utils';
import { Image as OriginImage, ImageProps, styled } from 'tushan';

const Image = styled(OriginImage)`
  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

export const TailchatImage: React.FC<ImageProps> = React.memo((props) => {
  return <Image {...props} src={parseUrlStr(props.src ?? '')} />;
});
TailchatImage.displayName = 'TailchatImage';
