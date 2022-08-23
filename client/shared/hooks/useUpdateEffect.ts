import { useEffect } from 'react';
import { createUpdateEffect } from './factory/createUpdateEffect';

export const useUpdateEffect = createUpdateEffect(useEffect);
