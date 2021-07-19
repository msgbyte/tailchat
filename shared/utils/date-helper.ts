import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'; // 导入插件
import 'dayjs/locale/zh-cn'; // 导入本地化语言

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

/**
 * 是否为当天
 */
export function isToday(date: Date): boolean {
  return dayjs(date).isSame(dayjs(), 'd');
}

/**
 * 获取消息显示时间
 */
export function getMessageTimeDiff(input: Date): string {
  const date = dayjs(input);

  if (isToday(input)) {
    return date.fromNow();
  } else {
    return date.format('YYYY-MM-DD HH:mm:ss');
  }
}
