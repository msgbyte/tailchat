/**
 * remove first [at=xxx]xxx[/at] in message first
 */
export function stripMentionTag(message: string): string {
  return message
    .trim()
    .replace(/^\[at=.*?\[\/at\]/, '')
    .replace(/^@\S*\s?/, '')
    .trimStart();
}
