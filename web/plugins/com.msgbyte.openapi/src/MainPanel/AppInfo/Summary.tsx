import { useOpenAppInfo } from '../context';
import React from 'react';

const Summary: React.FC = React.memo(() => {
  const { appId, appName } = useOpenAppInfo();

  return (
    <div>
      <div>{appId}</div>
      <div>{appName}</div>
    </div>
  );
});
Summary.displayName = 'Summary';

export default Summary;
