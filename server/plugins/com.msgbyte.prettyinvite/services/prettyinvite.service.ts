import type { GroupBaseInfo, TcPureContext } from 'tailchat-server-sdk';
import { TcService } from 'tailchat-server-sdk';

const badgeTemplate = (title: string, text: string) => {
  // 这个6.75计算的会不准、正确应该是5.5但是svg压缩时有误差
  const titleWidth = calcWordWidth(title) * 6.75 + 10;
  const iconWidth = 20;
  const textWidth = calcWordWidth(text) * 6.75 + 20;
  const textOffset = 60;

  // Fork from https://shields.io/
  return `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${
    titleWidth + iconWidth + textWidth
  }" height="20" role="img" aria-label="${title}: ${text}">
  <title>${title}: ${text}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${
      titleWidth + iconWidth + textWidth
    }" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${titleWidth + iconWidth}" height="20" fill="#555"/>
    <rect x="${
      titleWidth + iconWidth
    }" width="${textWidth}" height="20" fill="#4c1"/>
    <rect width="${
      titleWidth + iconWidth + textWidth
    }" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="${
      iconWidth * 10
    }" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" text-anchor="start">${title}</text>
    <text x="${
      iconWidth * 10
    }" y="140" transform="scale(.1)" fill="#fff" text-anchor="start">${title}</text>
    <text aria-hidden="true" x="${
      iconWidth * 10 + textOffset + titleWidth * 10
    }" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" text-anchor="start">${text}</text>
    <text x="${
      iconWidth * 10 + textOffset + titleWidth * 10
    }" y="140" transform="scale(.1)" fill="#fff" text-anchor="start">${text}</text>
  </g>

  <path d="M8.46431 6.62957C8.29495 6.62957 8.22818 6.54814 8.1549 6.45044C8.05719 6.32016 7.58494 6.0596 7.34067 6.09217C6.90216 6.15064 6.84127 6.09217 6.81956 6.0596C6.67626 5.98144 6.77071 5.57107 6.70557 5.31051C6.711 5.23995 6.66323 5.17372 6.42873 5.47336C6.19423 5.773 5.90762 6.33644 5.79363 6.58071C5.71764 6.82498 5.51679 7.26467 5.6145 7.70435C5.69994 8.08884 6.00533 8.45344 6.2496 8.66514C6.21052 9.04295 5.91952 9.32888 5.71221 9.75621C5.20057 10.8108 4.75467 11.6289 4.44201 12.4757C4.05118 13.5342 3.95347 14.6905 4.01861 15.2278C4.08375 15.7652 4.42572 16.5958 5.30509 17.0354C6.00859 17.3872 6.58615 17.4643 6.78699 17.4588C6.97698 17.6325 7.54586 17.9799 8.30146 17.9799C8.75743 18.019 9.37082 17.866 9.62052 17.7845L11.9329 16.7097C12.3075 16.5578 13.1738 16.3222 13.6428 16.5958C14.2291 16.9377 14.1476 17.0517 14.3268 17.3286C14.5059 17.6054 14.8479 17.752 15.1736 17.4588C15.4341 17.2243 15.2821 16.8617 15.1736 16.7097C15.103 16.5035 14.7795 15.9965 14.0499 15.6187C13.3204 15.2409 12.0849 15.5698 11.5584 15.7815C10.6334 16.2505 9.32739 16.7423 8.87142 16.8237C8.70858 16.8528 8.59459 16.9019 7.9432 16.8237C8.04742 16.5762 8.08433 16.1886 8.08976 16.0258C8.12233 15.4395 8.02462 15.1953 7.99205 15.0813C7.93079 14.8669 7.63379 13.8925 7.47095 13.4365C7.32981 12.8829 7.08836 12.2198 6.94984 11.4172C6.85619 10.8747 6.77609 10.5673 6.78699 10.0168C6.79306 9.71018 6.81956 9.41424 6.86158 9.23511C6.90359 9.05597 6.95871 9.01305 7.04755 8.99084C7.53609 9.00712 8.00834 9.00712 8.46431 8.66514C8.82908 8.39156 9.02884 7.81292 9.08312 7.55779C9.11569 7.32438 9.18083 6.80218 9.18083 6.58071C9.18083 6.35924 9.14826 6.2713 9.13198 6.25502C9.07987 6.20291 9.01256 6.23331 8.98542 6.25502C8.87685 6.39073 8.63367 6.62957 8.46431 6.62957Z" fill="#959DA5"/>
  <path d="M10.8093 2.49328C10.6798 2.28913 10.4999 2.02102 10.451 2.00474C10.4022 1.98845 10.3419 2.01381 10.3371 2.08616C10.3208 2.33043 10.3696 2.52584 10.3045 2.75383C10.2663 2.88761 10.0928 2.86782 9.91366 2.85154C9.61257 2.82417 9.27313 2.95467 9.14828 3.01438C8.99629 3.14466 8.67603 3.4215 8.61089 3.4215C8.54575 3.4215 8.12234 3.06324 8.12234 3.06324C8.12234 3.06324 7.91064 2.88411 7.91064 3.01438C7.91064 3.22283 7.91608 3.78519 7.94322 4.04031C7.9595 4.29544 8.09304 4.91317 8.49689 5.34308C8.90075 5.773 9.6531 5.78277 9.9788 5.73392C9.9788 5.73392 10.1272 5.76648 10.1905 5.84791C10.2538 5.92933 10.2719 6.13777 10.2719 6.84127C10.2719 7.72064 10.0276 8.43716 9.9788 8.82799C9.92994 9.21882 9.15814 11.4267 9.09943 11.6615C9.03429 11.9221 8.88772 12.8503 9.09942 13.5342C9.26878 14.0814 9.89737 14.2833 10.2719 14.2345C10.2719 14.4788 10.1905 14.6742 10.2719 15.3418C10.3733 16.1731 10.7279 16.9215 10.9233 17.1983C11.0861 17.3828 11.5454 17.8106 11.8841 18.0451C12.2228 18.2796 12.9263 18.4196 13.366 18.4196C13.8057 18.4196 14.0988 18.3382 14.4571 18.2242L16.2647 17.2146C16.2647 17.2146 16.5741 17.068 16.8183 16.9052C17.144 16.5534 16.9486 16.2864 16.8672 16.1398C16.7858 15.9932 16.6099 15.8792 15.9715 16.2049C14.8479 16.8563 14.0501 17.3611 13.2846 17.3611C12.568 17.3611 12.2401 17.1545 11.8352 16.6772C11.5887 16.3865 11.4118 15.7978 11.4118 15.7978C11.3358 15.4558 11.2295 14.6058 11.4118 13.9414C12.568 13.5505 13.024 12.6386 13.0892 11.7755C13.1413 11.085 12.7526 9.64222 12.5518 9.00712L12.0469 7.80206L11.2327 6.27131C11.1024 6.09218 10.8582 5.73392 10.8256 5.58735C10.8002 5.4729 10.8419 5.37023 10.8419 5.34308L11.0861 5.14767C11.0861 5.14767 11.2916 4.91749 11.363 4.74055C11.4279 4.57957 11.4444 4.31715 11.4444 4.31715C11.4444 4.31715 11.4607 3.89375 11.4118 3.73091C11.3384 3.48627 11.2551 3.35439 11.1676 3.14466C11.047 2.85565 10.9648 2.73844 10.8093 2.49328Z" fill="#959DA5"/>
</svg>
`;
};

/**
 * 邀请链接美化
 */
class PrettyinviteService extends TcService {
  get serviceName() {
    return 'plugin:com.msgbyte.prettyinvite';
  }

  onInit() {
    this.registerAction('badge', this.badge, {
      params: {
        inviteCode: 'string',
      },
    });

    this.registerAuthWhitelist(['/badge']);
  }

  async badge(
    ctx: TcPureContext<{
      inviteCode: string;
    }>
  ) {
    const inviteCode = ctx.params.inviteCode;

    const inviteInfo: any = await ctx.call('group.invite.findInviteByCode', {
      code: inviteCode,
    });

    if (!inviteInfo) {
      return {
        __raw: true,
        header: {
          'content-type': 'image/svg+xml; charset=utf-8',
        },
        html: badgeTemplate('Not Found', 'NaN'),
      };
    }

    const groupId = inviteInfo.groupId;
    const group: GroupBaseInfo = await ctx.call('group.getGroupBasicInfo', {
      groupId: String(groupId),
    });

    return {
      __raw: true,
      header: {
        'content-type': 'image/svg+xml; charset=utf-8',
      },
      html: badgeTemplate(group.name, String(group.memberCount)),
    };
  }
}

export default PrettyinviteService;

/**
 * 计算文本占据宽度
 * 单位为字符宽度
 */
function calcWordWidth(text: string): number {
  return text
    .split('')
    .map((char) => (char.charCodeAt(0) < 255 ? 1 : 2)) // 判断是否为ascii码
    .reduce((prev, curr) => prev + curr, 0);
}
