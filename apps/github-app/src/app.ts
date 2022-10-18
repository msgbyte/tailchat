import { Probot } from 'probot';
import metadata from 'probot-metadata';
import { TailchatClient } from './client';
import { configPath, generateErrorBlock } from './utils';

const LABEL = 'tailchat-topic';
const TOPIC_KEY = 'tailchatTopicId';

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

    try {
      const { data } = await ctx.octokit.repos.getContent(
        ctx.repo({
          path: configPath,
        })
      );

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

      // 发送到tailchat
      const topic = await tailchatClient.call(
        'plugin:com.msgbyte.topic.create',
        {
          groupId,
          panelId,
          content: `${ctx.payload.issue.user.login} create Issue\n\ntitle: ${
            ctx.payload.issue.title
          }\ncontent: ${ctx.payload.issue.body ?? ''}\n\nwebsite: ${
            ctx.payload.issue.html_url
          }`,
        }
      );

      await Promise.all([
        ctx.octokit.issues.createComment(
          ctx.issue({
            body: 'Thanks for opening this issue! Tailchat topic is created!',
          })
        ),
        ctx.octokit.issues.addLabels(
          ctx.repo({
            issue_number: ctx.payload.issue.number,
            labels: [LABEL],
          })
        ),
        metadata(ctx).set(TOPIC_KEY, topic._id),
      ]);
    } catch (err) {
      console.error(err);

      await ctx.octokit.issues.createComment(
        ctx.issue({
          body: generateErrorBlock(err),
        })
      );
    }
  });

  app.on('issue_comment.created', async (ctx) => {
    if (ctx.isBot) {
      return;
    }
    // 发送到tailchat

    try {
      const topicId = await metadata(ctx).get(TOPIC_KEY);
      if (!topicId) {
        return;
      }

      const { data } = await ctx.octokit.repos.getContent(
        ctx.repo({
          path: configPath,
        })
      );

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

      // 发送到tailchat
      await tailchatClient.call('plugin:com.msgbyte.topic.createComment', {
        groupId,
        panelId,
        topicId,
        content: `${ctx.payload.comment.user.login} reply Issue\n\ncontent: ${
          ctx.payload.issue.body ?? ''
        }\n\nWebsite: ${ctx.payload.comment.html_url}`,
      });
    } catch (err) {
      console.error(err);

      await ctx.octokit.issues.createComment(
        ctx.issue({
          body: generateErrorBlock(err),
        })
      );
    }
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
