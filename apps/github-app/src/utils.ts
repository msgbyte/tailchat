export const configPath = '.tailchat/topic.json';

export function generateErrorBlock(err: unknown) {
  const detail = err instanceof Error ? err : new Error(String(err));
  const codesign = '```';
  const errorBlock = `${codesign}\n${detail.name}${detail.message}\n${detail.stack}\n${codesign}`;

  return `Tailchat occur error, please checkout your config in \`${configPath}\`! \n${errorBlock}`;
}
