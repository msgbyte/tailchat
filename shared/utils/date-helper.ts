import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'; // 导入插件
import 'dayjs/locale/zh-cn'; // 导入本地化语言
import { onLanguageChange } from '../i18n';

/**
 * Reference: https://day.js.org/
 */

dayjs.extend(relativeTime);
dayjs.locale('zh-cn'); // 默认使用中文
onLanguageChange((lang) => {
  if (lang === 'en-US') {
    dayjs.locale('en');
    return;
  }

  dayjs.locale('zh-cn');
});

/**
 * 是否为当天
 */
export function isToday(date: dayjs.ConfigType): boolean {
  return dayjs(date).isSame(dayjs(), 'd');
}

/**
 * 获取消息显示时间
 */
export function getMessageTimeDiff(input: Date): string {
  const date = dayjs(input);

  if (isToday(date)) {
    return date.fromNow();
  } else {
    return date.format('YYYY-MM-DD HH:mm:ss');
  }
}

/**
 * 是否应该显示消息时间
 * 间隔时间大于十五分钟则显示
 */
export function shouldShowMessageTime(date1: Date, date2: Date): boolean {
  return Math.abs(date1.valueOf() - date2.valueOf()) > 15 * 60 * 1000;
}

/**
 * 格式化为 小时:分钟
 */
export function formatShortTime(date: dayjs.ConfigType): string {
  return dayjs(date).format('HH:mm');
}

/**
 * 格式化为 小时:分钟
 */
export function formatFullTime(date: dayjs.ConfigType): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 返回当前实例到现在的相对时间。
 * @example
 * dayjs('1999-01-01').toNow() // 22 年后
 */
export function datetimeToNow(input: dayjs.ConfigType): string {
  const date = dayjs(input);
  return date.toNow();
}

/**
 * 返回当前实例到现在的相对时间。
 * @example
 * dayjs('1999-01-01').toNow() // 22 年前
 */
export function datetimeFromNow(input: dayjs.ConfigType): string {
  const date = dayjs(input);
  return date.fromNow();
}
