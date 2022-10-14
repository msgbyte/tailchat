import { Probot } from 'probot';
import { TailchatClient } from './client';

const configPath = '.tailchat/topic.json';

export function app(app: Probot) {
  if (
    !process.env.TAILCHAT_API_URL ||
    !process.env.TAILCHAT_APP_ID ||
    !process.env.TAILCHAT_APP_SECRET
  ) {
    throw new Error(
      'Require env: TAILCHAT_API_URL, TAILCHAT_APP_ID, TAILCHAT_APP_SECRET'
    );
  }

  const tailchatClient = new TailchatClient(
    process.env.TAILCHAT_API_URL,
    process.env.TAILCHAT_APP_ID,
    process.env.TAILCHAT_APP_SECRET
  );

  app.on('issues.opened', async (ctx) => {
    if (ctx.isBot) {
      return;
    }

    const { data } = await ctx.octokit.repos.getContent(
      ctx.repo({
        path: configPath,
      })
    );

    try {
      if (!(!Array.isArray(data) && 'content' in data)) {
        throw new Error('config file type error');
      }

      // 是配置文件

      const content = Buffer.from(data.content, 'base64').toString();
      const json = await JSON.parse(content);
      const groupId = json['groupId'];
      const panelId = json['panelId'];

      if (!groupId || !panelId) {
        throw new Error('config format error');
      }

      console.log(json);

      // TODO: 发送到tailchat

      await Promise.all([
        ctx.octokit.issues.createComment(
          ctx.issue({
            body: 'Thanks for opening this issue! Tailchat topic is created!',
          })
        ),
        ctx.octokit.issues.addLabels(
          ctx.repo({
            issue_number: ctx.payload.issue.number,
            labels: ['tailchat-topic'],
          })
        ),
      ]);
    } catch (err) {
      console.error(err);
      await ctx.octokit.issues.createComment(
        ctx.issue({
          body: `Tailchat topic create error, please checkout your config in \`${configPath}\`!`,
        })
      );
    }
  });

  app.on('issue_comment.created', async () => {
    // 发送到tailchat
  });

  app.on('installation.created', async (ctx) => {
    const installationId = ctx.payload.installation.id;
    const installationTargetName = ctx.payload.installation.account.login;
    const installationTargetRepositories = ctx.payload.repositories;

    console.log('installation.created', {
      installationId,
      installationTargetName,
      installationTargetRepositories,
    });
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
