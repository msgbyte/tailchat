import { Probot } from 'probot';
import metadata from 'probot-metadata';
import { TailchatClient } from './client';
import { configPath, generateErrorBlock } from './utils';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const LABEL = 'tailchat-topic';
const TOPIC_KEY = 'tailchatTopicId';

if (
  !process.env.TAILCHAT_API_URL ||
  !process.env.TAILCHAT_APP_ID ||
  !process.env.TAILCHAT_APP_SECRET
) {
  throw new Error(
    'Require env: TAILCHAT_API_URL, TAILCHAT_APP_ID, TAILCHAT_APP_SECRET'
  );
}

const defaultTailchatApiUrl = process.env.TAILCHAT_API_URL;
const tailchatAppId = process.env.TAILCHAT_APP_ID;
const tailchatAppSecret = process.env.TAILCHAT_APP_SECRET;

export function app(app: Probot) {
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

      const { tailchatClient, groupId, panelId } =
        createTailchatContextWithConfig(data.content);

      console.log('配置信息', { tailchatClient, groupId, panelId });

      // 发送到tailchat
      const { data: topic } = await tailchatClient.call(
        'plugin:com.msgbyte.topic.create',
        {
          groupId,
          panelId,
          content: `[b]${
            ctx.payload.issue.user.login
          }[/b] create Issue:\n\nTitle: ${ctx.payload.issue.title}\n[markdown]${
            ctx.payload.issue.body ?? ''
          }[/markdown]\n\nWebsite: ${ctx.payload.issue.html_url}`,
          meta: {
            githubRepoOwner: ctx.payload.repository.owner.login,
            githubRepoName: ctx.payload.repository.name,
            githubIssueNumber: ctx.payload.issue.number,
          },
        }
      );

      console.log('Tailchat Topic 创建成功', topic);

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

      console.log('发送相关信息到 Github 完毕');
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
      console.error('This comment created by Bot, Skip!');
      return;
    }
    // 发送到tailchat

    try {
      const topicId = await metadata(ctx).get(TOPIC_KEY);
      if (!topicId) {
        console.error('Not found topic id, Skip!');
        return;
      }

      const { data } = await ctx.octokit.repos.getContent(
        ctx.repo({
          path: configPath,
        })
      );

      if (!(!Array.isArray(data) && 'content' in data)) {
        throw new Error('Config file type error');
      }

      // 是配置文件

      const { tailchatClient, groupId, panelId } =
        createTailchatContextWithConfig(data.content);

      // 发送到tailchat
      await tailchatClient.call('plugin:com.msgbyte.topic.createComment', {
        groupId,
        panelId,
        topicId,
        content: `[b]${
          ctx.payload.comment.user.login
        }[/b] reply Issue:\n\n[markdown]${
          ctx.payload.comment.body ?? ''
        }[/markdown]\n\nWebsite: ${ctx.payload.comment.html_url}`,
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

  // app.on('installation.created', async (ctx) => {
  //   const installationId = ctx.payload.installation.id;
  //   const installationTargetName = ctx.payload.installation.account.login;
  //   const installationTargetRepositories = ctx.payload.repositories;

  //   console.log('installation.created', {
  //     installationId,
  //     installationTargetName,
  //     installationTargetRepositories,
  //   });
  // });
}

/**
 * 从配置文件中创建上下文
 */
function createTailchatContextWithConfig(githubRaw: string) {
  const content = Buffer.from(githubRaw, 'base64').toString();
  const json = JSON.parse(content);
  const tailchatHost = json['tailchatHost'];
  const groupId = json['groupId'];
  const panelId = json['panelId'];

  if (!groupId || !panelId) {
    throw new Error('config format error');
  }

  const tailchatClient = new TailchatClient(
    tailchatHost ?? defaultTailchatApiUrl,
    tailchatAppId,
    tailchatAppSecret
  );

  return {
    tailchatClient,
    groupId,
    panelId,
  };
}
