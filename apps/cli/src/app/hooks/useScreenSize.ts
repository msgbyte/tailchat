import { useCallback, useEffect, useState } from 'react';
import { useStdout } from 'ink';

export function useScreenSize() {
  const { stdout } = useStdout();
  const getSize = useCallback(
    () => ({
      height: stdout?.rows ?? 0,
      width: stdout?.columns ?? 0,
    }),
    [stdout]
  );
  const [size, setSize] = useState(getSize);

  useEffect(() => {
    const onResize = () => setSize(getSize());
    stdout?.on('resize', onResize);

    return () => {
      stdout?.off('resize', onResize);
    };
  }, [stdout, getSize]);

  return size;
}
