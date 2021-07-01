// api
export { buildStorage } from './api/buildStorage';

// components
export { FastForm } from './components/FastForm/index';
export { CustomField } from './components/FastForm/CustomField';
export type {
  FastFormFieldComponent,
  FastFormFieldProps,
  FastFormFieldMeta,
} from './components/FastForm/field';
export { regField } from './components/FastForm/field';
export { regFormContainer } from './components/FastForm/container';
export type { FastFormContainerComponent } from './components/FastForm/container';

// manager
export { getStorage, setStorage, useStorage } from './manager/storage';
