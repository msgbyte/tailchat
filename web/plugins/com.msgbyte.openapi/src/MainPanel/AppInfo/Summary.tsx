import { useOpenAppInfo } from '../context';
import React from 'react';

const Summary: React.FC = React.memo(() => {
  const { refresh, ...other } = useOpenAppInfo();

  return <pre>{JSON.stringify(other, undefined, 2)}</pre>;
});
Summary.displayName = 'Summary';

export default Summary;
