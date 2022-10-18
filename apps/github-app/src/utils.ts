export const configPath = '.tailchat/topic.json';

export function generateErrorBlock(err: unknown) {
  const detail = err instanceof Error ? err : new Error(String(err));
  const errorBlock =
    '```' + detail.name + detail.message + '\n' + (detail.stack ?? '') + '```';

  return `Tailchat occur error, please checkout your config in \`${configPath}\`! \nError:\nw${errorBlock}`;
}
