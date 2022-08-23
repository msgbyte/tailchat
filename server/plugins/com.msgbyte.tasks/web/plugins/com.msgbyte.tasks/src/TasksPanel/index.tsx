import React, { useEffect } from 'react';
import { useAsyncFn } from '@capital/common';
import { PillTabs, PillTabPane } from '@capital/component';
import type { TaskItemType } from './type';
import { TaskItem } from './TaskItem';
import { NewTask } from './NewTask';
import { Translate } from '../translate';
import { request } from '../request';
import './index.less';

const TasksPanel: React.FC = React.memo(() => {
  const [{ value }, fetch] = useAsyncFn(
    () => request.get('all').then(({ data }) => data),
    []
  );
  const tasks: TaskItemType[] = Array.isArray(value) ? value : [];

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div className="plugin-tasks-panel">
      <div className="plugin-task-title">{Translate.tasks}</div>

      <NewTask onSuccess={fetch} />

      <PillTabs>
        <PillTabPane key={1} tab={Translate.undone}>
          <div>
            {tasks
              .filter((t) => !t.done)
              .map((task) => (
                <TaskItem key={task._id} task={task} />
              ))}
          </div>
        </PillTabPane>

        <PillTabPane key={2} tab={Translate.done}>
          <div>
            {tasks
              .filter((t) => t.done)
              .map((task) => (
                <TaskItem key={task._id} task={task} />
              ))}
          </div>
        </PillTabPane>
      </PillTabs>
    </div>
  );
});
TasksPanel.displayName = 'TasksPanel';

export default TasksPanel;
