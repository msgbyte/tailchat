import { ApplicationFunction, Probot } from 'probot';
import metadata from 'probot-metadata';
import { TailchatClient } from './client';
import {
  configPath,
  generateErrorBlock,
  generateTopicCommentCreateContent,
  generateTopicCreateContent,
} from './utils';
import bodyParser from 'body-parser';
import _ from 'lodash';
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
const tailchatWebUrl =
  process.env.TAILCHAT_WEB_URL || process.env.TAILCHAT_API_URL;

export const appFn: ApplicationFunction = (app, { getRouter }) => {
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
          content: generateTopicCreateContent(
            ctx.payload.issue.user.login,
            ctx.payload.issue.title,
            ctx.payload.issue.body ?? '',
            ctx.payload.issue.html_url
          ),
          meta: {
            tailchatHost: tailchatClient.url,
            installationId: ctx.payload.installation?.id,
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
            body: `Thanks for opening this issue! Tailchat topic is created in ${tailchatWebUrl}/main/group/${groupId}/${panelId}!`,
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
        content: generateTopicCommentCreateContent(
          ctx.payload.comment.user.login,
          ctx.payload.comment.body ?? '',
          ctx.payload.comment.html_url
        ),
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

  buildRouter(app, getRouter);
};

/**
 * 从配置文件中创建上下文
 *
 * 因为考虑serverless服务因此不能全局管理
 */
function createTailchatContextWithConfig(githubRaw: string) {
  const content = Buffer.from(githubRaw, 'base64').toString();
  const json = JSON.parse(content);
  const tailchatHost = json['tailchatHost'] ?? defaultTailchatApiUrl;
  const groupId = json['groupId'];
  const panelId = json['panelId'];

  if (!groupId || !panelId) {
    throw new Error('config format error');
  }

  const tailchatClient = createTailchatClient(tailchatHost);

  return {
    tailchatClient,
    groupId,
    panelId,
  };
}

function createTailchatClient(tailchatHost = defaultTailchatApiUrl) {
  const tailchatClient = new TailchatClient(
    tailchatHost,
    tailchatAppId,
    tailchatAppSecret
  );

  return tailchatClient;
}

function buildRouter(
  app: Probot,
  getRouter: Parameters<ApplicationFunction>[1]['getRouter']
) {
  if (getRouter) {
    getRouter('/')
      .get('/', (_req, res) => {
        res.send('Hello World! Github app server is working!');
      })
      .post('/message/webhook', bodyParser.json(), (req, res) => {
        (async () => {
          try {
            // 根据收件箱内容向 Github Issue 创建话题
            const inboxItem = req.body ?? {};
            if (inboxItem.type !== 'plugin:com.msgbyte.topic.comment') {
              // 如果不是回复消息，则跳过
              return;
            }

            const newComment: any =
              _.last(_.get(inboxItem, ['payload', 'comments'])) ?? {};
            const meta = _.get(inboxItem, ['payload', 'meta']) ?? {};
            if (
              !meta.installationId ||
              !meta.githubRepoOwner ||
              !meta.githubRepoName ||
              !meta.githubIssueNumber
            ) {
              console.warn('Cannot pass meta info check:', { meta });
              return;
            }
            if (!newComment.author || !newComment.content) {
              console.warn(
                'Cannot get "newComment.author" or "newComment.content"'
              );
              return;
            }

            // 发送到github comment
            const octokit = await app.auth(Number(meta.installationId));
            const tailchatClient = createTailchatClient(meta.tailchatHost);
            const userInfo = await tailchatClient.call('user.getUserInfo', {
              userId: newComment.author,
            });

            const payload = {
              owner: meta.githubRepoOwner,
              repo: meta.githubRepoName,
              issue_number: meta.githubIssueNumber,
              body: `[${_.get(userInfo, [
                'data',
                'nickname',
              ])}] 在 Tailchat 回复:\n\`\`\`\n${
                newComment.content ?? ''
              }\n\`\`\``,
            };

            console.log('正在向Github Issue创建回复:', payload);

            await octokit.issues.createComment(payload);
          } catch (err) {
            console.error(err);
          }
        })();

        res.send('Success!');
      });
  }
}
