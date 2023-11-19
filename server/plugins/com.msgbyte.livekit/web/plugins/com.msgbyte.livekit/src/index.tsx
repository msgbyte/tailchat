import {
  regCustomPanel,
  regGroupPanel,
  regGroupPanelBadge,
  regPluginPanelAction,
  regPluginPanelRoute,
  panelWindowManager,
  regSocketEventListener,
  getGlobalState,
} from '@capital/common';
import { Loadable } from '@capital/component';
import { useIconIsShow } from './navbar/useIconIsShow';
import { Translate } from './translate';

const PLUGIN_ID = 'com.msgbyte.livekit';

console.log(`Plugin ${PLUGIN_ID} is loaded`);

const LivekitPanel = Loadable(() => import('./group/LivekitPanel'), {
  componentName: `${PLUGIN_ID}:LivekitPanel`,
});

const LivekitMeetingPanel = Loadable(
  () => import('./panel/LivekitMeetingPanel'),
  {
    componentName: `${PLUGIN_ID}:LivekitMeetingPanel`,
  }
);

regGroupPanel({
  name: `${PLUGIN_ID}/livekitPanel`,
  label: Translate.voiceChannel,
  provider: PLUGIN_ID,
  render: LivekitPanel,
});

regGroupPanelBadge({
  name: `${PLUGIN_ID}/livekitPanelBadge`,
  panelType: `${PLUGIN_ID}/livekitPanel`,
  render: Loadable(() => import('./group/LivekitPanelBadge'), {
    componentName: `${PLUGIN_ID}:LivekitPanelBadge`,
    fallback: null,
  }),
});

regCustomPanel({
  position: 'navbar-more',
  icon: 'mingcute:voice-line',
  name: `${PLUGIN_ID}/livekitNavbarIcon`,
  label: Translate.toVoiceChannel,
  render: Loadable(
    () =>
      import('./navbar/redirect').then(
        (module) => module.LivekitNavbarRedirect
      ),
    {
      componentName: `${PLUGIN_ID}:LivekitNavbarRedirect`,
    }
  ),
  useIsShow: useIconIsShow,
});

regPluginPanelRoute({
  name: `${PLUGIN_ID}/livekitPanel`,
  path: `/${PLUGIN_ID}/meeting/:meetingId`,
  component: LivekitMeetingPanel,
});

// 发起私信会议
regPluginPanelAction({
  name: `${PLUGIN_ID}/groupAction`,
  label: Translate.startCall,
  position: 'dm',
  icon: 'mdi:video-box',
  onClick: ({ converseId }) => {
    const state = getGlobalState() ?? {};
    const currentUserId = state.user?.info?._id ?? '';
    const members: string[] =
      state.chat?.converses?.[converseId]?.members ?? [];
    const shouldInviteUserIds = members.filter((m) => m !== currentUserId);
    const win = panelWindowManager.open(
      `/panel/plugin/${PLUGIN_ID}/meeting/${converseId}`,
      {
        width: 1280,
        height: 768,
      }
    );
    (win.window as any).autoInviteIds = shouldInviteUserIds;
  },
});
