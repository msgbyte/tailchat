import childProcess from 'child_process';

/**
 * workbox 匹配plugin的缓存
 */
export const workboxPluginPattern =
  /plugins\/com\.msgbyte(.*?)\/((?!index).)*?\.js/;

export function getCommitHash(): string {
  return String(childProcess.execSync('git rev-parse HEAD'));
}
