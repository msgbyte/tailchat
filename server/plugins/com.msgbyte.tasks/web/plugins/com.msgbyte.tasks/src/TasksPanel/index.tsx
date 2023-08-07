import React, { useEffect } from 'react';
import { useAsyncFn } from '@capital/common';
import { PillTabs } from '@capital/component';
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

      <PillTabs
        items={[
          {
            key: '1',
            label: Translate.undone,
            children: (
              <div>
                {tasks
                  .filter((t) => !t.done)
                  .map((task) => (
                    <TaskItem key={task._id} task={task} />
                  ))}
              </div>
            ),
          },
          {
            key: '2',
            label: Translate.done,
            children: (
              <div>
                {tasks
                  .filter((t) => t.done)
                  .map((task) => (
                    <TaskItem key={task._id} task={task} />
                  ))}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
});
TasksPanel.displayName = 'TasksPanel';

export default TasksPanel;
