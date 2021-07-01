import React, { useContext } from 'react';
import type { useFormik } from 'formik';

type FastFormContextType = ReturnType<typeof useFormik>;

export const FastFormContext = React.createContext<FastFormContextType | null>(
  null
);
FastFormContext.displayName = 'FastFormContext';

export function useFastFormContext(): FastFormContextType | null {
  return useContext(FastFormContext);
}
