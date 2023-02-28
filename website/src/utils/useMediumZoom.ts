import { useEffect } from 'react';
import mediumZoom from 'medium-zoom';

export function useMediumZoom() {
  useEffect(() => {
    mediumZoom('[data-zoomable]');
  }, []);
}
