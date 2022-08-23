import { localTrans } from '@capital/common';

export const Translate = {
  tasks: localTrans({ 'zh-CN': '任务', 'en-US': 'Tasks' }),
  tasksService: localTrans({ 'zh-CN': '任务服务', 'en-US': 'Tasks Service' }),
  insertTip: localTrans({ 'zh-CN': '添加任务', 'en-US': 'Insert Task' }),
  done: localTrans({ 'zh-CN': '已完成', 'en-US': 'Done' }),
  undone: localTrans({ 'zh-CN': '未完成', 'en-US': 'Undone' }),
  emptyTip: localTrans({
    'zh-CN': '请输入内容',
    'en-US': 'Please enter content',
  }),
};
