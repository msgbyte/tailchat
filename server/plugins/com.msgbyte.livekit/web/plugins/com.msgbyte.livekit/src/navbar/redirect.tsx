import { useNavigate } from '@capital/common';
import React, { useEffect } from 'react';
import { useLivekitState } from '../store/useLivekitState';

export const LivekitNavbarRedirect: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const { isActive, url } = useLivekitState();

  useEffect(() => {
    if (isActive) {
      navigate(url);
    }
  }, []);

  return <div>Redirect...</div>;
});
LivekitNavbarRedirect.displayName = 'LivekitNavbarRedirect';
