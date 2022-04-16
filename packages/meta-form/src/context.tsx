import React, { useContext } from 'react';
import type { useFormik } from 'formik';

type MetaFormContextType = ReturnType<typeof useFormik>;

export const MetaFormContext = React.createContext<MetaFormContextType | null>(
  null
);
MetaFormContext.displayName = 'MetaFormContext';

export function useMetaFormContext(): MetaFormContextType | null {
  return useContext(MetaFormContext);
}
