import { useGroupPanelContext } from '@/context/GroupPanelContext';
import React, { useReducer, useRef } from 'react';
import {
  model,
  PERMISSION,
  showSuccessToasts,
  showToasts,
  t,
  useAsync,
  useHasGroupPermission,
  useMemoizedFn,
} from 'tailchat-shared';
import { Problem } from '@/components/Problem';
import { ErrorView } from '@/components/ErrorView';
import { Loading } from '@/components/Loading';
import { GroupPanelContainer } from './shared/GroupPanelContainer';
import { IconBtn } from '@/components/IconBtn';
import { openModal } from '@/components/Modal';
import _isEqual from 'lodash/isEqual';

type GroupExtraDataPanelRenderInfo = Record<string, string>; // <name, value>

interface GroupExtraDataPanelInnerProps extends GroupExtraDataPanelProps {
  groupId: string;
  panelId: string;
}

/**
 * A Component which can edit panel and display with group extra data
 */
const GroupExtraDataPanelInner: React.FC<GroupExtraDataPanelInnerProps> =
  React.memo((props) => {
    const { groupId, panelId, names } = props;
    const [updateIndex, updateInfo] = useReducer((state) => state + 1, 0);
    const {
      value: info = {},
      loading,
      error,
    } = useAsync(async () => {
      const list = await Promise.all(
        names.map((name) =>
          model.group
            .getGroupPanelExtraData(props.groupId, props.panelId, name)
            .then((data) => ({
              name,
              data,
            }))
        )
      );

      return list.reduce((prev, curr) => {
        return {
          ...prev,
          [curr.name]: curr.data,
        };
      }, {});
    }, [groupId, panelId, names, updateIndex]);

    const [hasPermission] = useHasGroupPermission(groupId, [
      PERMISSION.core.managePanel,
    ]);

    const savingRef = useRef(false);
    const handleEdit = useMemoizedFn(() => {
      const dataMap = { ...info };
      if (!props.renderEdit) {
        console.warn('[GroupExtraDataPanel] Please set renderEdit');
        return;
      }

      const handleSave = async () => {
        if (savingRef.current === true) {
          showToasts(t('正在保存, 请稍后'));
          return;
        }

        if (!_isEqual(dataMap, info)) {
          savingRef.current = true;
          await Promise.all(
            Object.entries(dataMap).map(([name, data]) =>
              model.group.saveGroupPanelExtraData(groupId, panelId, name, data)
            )
          );

          savingRef.current = false;
          updateInfo();

          showSuccessToasts();
        }
      };

      openModal(props.renderEdit(dataMap), {
        onCloseModal: handleSave,
      });
    });

    if (error) {
      return <ErrorView error={error} />;
    }

    return (
      <GroupPanelContainer
        groupId={groupId}
        panelId={panelId}
        prefixActions={() =>
          hasPermission
            ? [
                <IconBtn
                  key="edit"
                  title={t('编辑')}
                  shape="square"
                  icon="mdi:square-edit-outline"
                  iconClassName="text-2xl"
                  onClick={handleEdit}
                />,
              ]
            : []
        }
      >
        <Loading className="h-full w-full" spinning={loading}>
          <div className="overflow-auto h-full">{props.render(info)}</div>
        </Loading>
      </GroupPanelContainer>
    );
  });
GroupExtraDataPanelInner.displayName = 'GroupExtraDataPanelInner';

interface GroupExtraDataPanelProps {
  names: string[];
  renderEdit: (dataMap: Record<string, string>) => React.ReactNode;
  render: (info: GroupExtraDataPanelRenderInfo) => React.ReactNode;
}
export const GroupExtraDataPanel: React.FC<GroupExtraDataPanelProps> =
  React.memo((props) => {
    const context = useGroupPanelContext();

    if (context === null) {
      return <Problem text={t('组件只能在群组面板中才能正常显示')} />;
    }

    return (
      <GroupExtraDataPanelInner
        {...props}
        groupId={context.groupId}
        panelId={context.panelId}
      />
    );
  });
GroupExtraDataPanel.displayName = 'GroupExtraDataPanel';
