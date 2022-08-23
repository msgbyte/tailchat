import { regCustomPanel, Loadable, regInspectService } from '@capital/common';
import { Translate } from './translate';

regCustomPanel({
  position: 'personal',
  icon: 'mdi:checkbox-marked-outline',
  name: 'com.msgbyte.tasks/tasksPanel',
  label: Translate.tasks,
  render: Loadable(() => import('./TasksPanel')),
});

regInspectService({
  name: 'plugin:com.msgbyte.tasks',
  label: Translate.tasksService,
});
