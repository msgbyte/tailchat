import { Col, Divider, Row, Switch } from 'antd';
import React from 'react';
import {
  getPermissionList,
  GroupPanelType,
  PermissionItemType,
  t,
  useEvent,
} from 'tailchat-shared';
import _uniq from 'lodash/uniq';
import _without from 'lodash/without';
import { pluginPermission } from '@/plugin/common';

interface PermissionListProps {
  /**
   * 面板类型，如果没传说明是群组，则展示所有的
   */
  panelType?: string | GroupPanelType.TEXT | GroupPanelType.GROUP;
  value: string[];
  onChange: (value: string[]) => void;
}
export const PermissionList: React.FC<PermissionListProps> = React.memo(
  (props) => {
    const handleSwitchPermission = useEvent(
      (permissionKey: string, enabled: boolean) => {
        if (enabled) {
          props.onChange(_uniq([...props.value, permissionKey]));
        } else {
          props.onChange(_without(props.value, permissionKey));
        }
      }
    );

    const panelPermissionFilterFn = useEvent(
      (permissionInfo: PermissionItemType) => {
        if (typeof props.panelType === 'undefined') {
          // 如果不传则无限制
          return true;
        }

        if (!permissionInfo.panel) {
          // 没有定义面板信息，则该权限不适用于面板策略
          return false;
        }

        if (permissionInfo.panel === true) {
          return true;
        }

        if (Array.isArray(permissionInfo.panel)) {
          return permissionInfo.panel.includes(props.panelType);
        }
      }
    );

    const builtinPermissionList = getPermissionList().filter(
      panelPermissionFilterFn
    );
    const pluginPermissionList = pluginPermission.filter(
      panelPermissionFilterFn
    );

    if (
      builtinPermissionList.length === 0 &&
      pluginPermissionList.length === 0
    ) {
      return <div className="text-center">{t('暂无可用的权限项')}</div>;
    }

    return (
      <div>
        {/* 权限详情 */}
        {builtinPermissionList.map((p) => (
          <PermissionItem
            key={p.key}
            title={p.title}
            desc={p.desc}
            disabled={
              p.required
                ? !p.required.every((r) => props.value.includes(r))
                : undefined
            }
            checked={props.value.includes(p.key)}
            onChange={(checked) => handleSwitchPermission(p.key, checked)}
          />
        ))}

        {pluginPermissionList.length > 0 && (
          <>
            <Divider>{t('以下为插件权限')}</Divider>

            {/* 权限详情 */}
            {pluginPermission.map((p) => (
              <PermissionItem
                key={p.key}
                title={p.title}
                desc={p.desc}
                disabled={
                  p.required
                    ? !p.required.every((r) => props.value.includes(r))
                    : undefined
                }
                checked={props.value.includes(p.key)}
                onChange={(checked) => handleSwitchPermission(p.key, checked)}
              />
            ))}
          </>
        )}
      </div>
    );
  }
);
PermissionList.displayName = 'PermissionList';

interface PermissionItemProps {
  title: string;
  desc?: string;
  disabled?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const PermissionItem: React.FC<PermissionItemProps> = React.memo((props) => {
  return (
    <div className="mx-2 py-3 border-b border-white border-opacity-20">
      <Row>
        <Col flex={1} className="font-bold">
          {props.title}
        </Col>

        <Col>
          <Switch
            disabled={props.disabled}
            checked={props.checked}
            onChange={props.onChange}
          />
        </Col>
      </Row>

      <div className="text-gray-400">{props.desc}</div>
    </div>
  );
});
PermissionItem.displayName = 'PermissionItem';
