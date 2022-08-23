import React from 'react';
import { Trans as OriginalTrans, TransProps } from 'react-i18next';

type Props = Omit<TransProps<string>, 't'>;
export const Trans: React.FC<Props> = React.memo((props) => {
  return <OriginalTrans>{props.children}</OriginalTrans>;
});
Trans.displayName = 'Trans';
