import { useParams } from 'react-router';

/**
 * 获取群组面板的参数
 */
export function useGroupPanelParams(): {
  groupId: string;
  panelId: string;
} {
  const { groupId = '', panelId = '' } = useParams<{
    groupId: string;
    panelId: string;
  }>();

  return { groupId, panelId };
}
