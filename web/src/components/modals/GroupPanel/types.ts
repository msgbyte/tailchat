import type { GroupPanelType } from 'tailchat-shared';

export interface GroupPanelValues {
  name: string;
  type: string | GroupPanelType;
  [key: string]: unknown;
}
