export const configPath = '.tailchat/topic.json';

/**
 * 输入错误对象
 * 返回一个详细信息的markdown字段
 */
export function generateErrorBlock(err: unknown) {
  const detail = err instanceof Error ? err : new Error(String(err));
  const codesign = '```';
  const errorBlock = `${codesign}\n${detail.name}${detail.message}\n${detail.stack}\n${codesign}`;

  return `Tailchat occur error, please checkout your config in \`${configPath}\`! \n${errorBlock}`;
}

/**
 * 生成创建话题的内容
 */
export function generateTopicCreateContent(
  user: string,
  title: string,
  body: string,
  url: string
) {
  return `[b]${user}[/b] create Issue:
[b]Title: ${title}[/b]
[markdown]${body}[/markdown]

Website: ${url}`;
}

/**
 * 生成创建话题的内容
 */
export function generateTopicCommentCreateContent(
  user: string,
  body: string,
  url: string
) {
  return `[b]${user}[/b] reply Issue:
[markdown]${body}[/markdown]

Website: ${url}`;
}
