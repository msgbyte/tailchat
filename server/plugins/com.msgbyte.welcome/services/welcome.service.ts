import { call, TcContext } from 'tailchat-server-sdk';
import { TcService } from 'tailchat-server-sdk';

/**
 * 入群欢迎
 *
 * 加入群组时发送欢迎消息
 */
class WelcomeService extends TcService {
  get serviceName() {
    return 'plugin:com.msgbyte.welcome';
  }

  onInit() {
    this.registryAfterActionHook('group.joinGroup', 'joinGroupCallback'); // not work

    this.registerAction('joinGroupCallback', this.joinGroupCallback, {
      params: {
        groupId: 'string',
      },
      visibility: 'public',
    });
  }

  async joinGroupCallback(
    ctx: TcContext<{
      groupId: string;
    }>
  ) {
    const { groupId } = ctx.params;

    const groupInfo = await call(ctx).getGroupInfo(groupId);

    if (groupInfo.config && groupInfo.config['plugin:groupWelcomeText']) {
      // 有欢迎词

      const lobbyConverseId = await call(ctx).getGroupLobbyConverseId(groupId);

      if (!lobbyConverseId) {
        // 如果没有文本频道则跳过
        return;
      }

      const [welcomeText, meta] = await parseGroupWelcomeText(
        ctx,
        groupInfo.config['plugin:groupWelcomeText']
      );

      await ctx.call(
        'chat.message.sendMessage',
        {
          converseId: lobbyConverseId,
          groupId: groupId,
          content: welcomeText,
          meta,
        },
        {
          meta: {
            ...ctx.meta,
            userId: groupInfo.owner, // 以群组owner的名义
          },
        }
      );
    }
  }
}

export default WelcomeService;

async function parseGroupWelcomeText(
  ctx: TcContext,
  welcomeText: string
): Promise<[string, {}]> {
  const meta: Record<string, any> = {};
  if (
    welcomeText.includes('{nickname}') ||
    welcomeText.includes('{@nickname}')
  ) {
    const memberInfo = await call(ctx).getUserInfo(ctx.meta.userId);
    const nickname = memberInfo.nickname;
    const userId = String(memberInfo._id);

    welcomeText = welcomeText.replaceAll('{nickname}', nickname);

    if (welcomeText.includes('{@nickname}')) {
      welcomeText = welcomeText.replaceAll(
        '{@nickname}',
        `[at=${userId}]${nickname}[/at]`
      );
      meta.mentions = [String(userId)];
    }
  }

  return [welcomeText, meta];
}
