import React, { useState } from 'react';
import type { TaskItemType } from './type';
import { useAsyncFn } from '@capital/common';
import { Checkbox } from '@capital/component';
import { request } from '../request';

/**
 * 任务项
 */
export const TaskItem: React.FC<{
  task: TaskItemType;
}> = React.memo(({ task }) => {
  const taskId = task._id;
  const [done, setDone] = useState(task.done);
  const [{ loading }, handleChange] = useAsyncFn(
    async (e) => {
      const checked = e.target.checked;

      if (checked) {
        await request.post('done', {
          taskId,
        });
        setDone(true);
      } else {
        await request.post('undone', {
          taskId,
        });
        setDone(false);
      }
    },
    [taskId]
  );

  return (
    <div className="plugin-task-item">
      <Checkbox disabled={loading} checked={done} onChange={handleChange} />

      <div
        className={`plugin-task-item_body ${
          done ? 'plugin-task-item_body-done' : ''
        }`}
      >
        <div>{task.title}</div>
        <div>{task.description}</div>
      </div>
    </div>
  );
});
TaskItem.displayName = 'TaskItem';
