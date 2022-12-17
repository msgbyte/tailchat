import React, { useMemo } from 'react';
import { Select } from 'antd';
import { GroupPanelType, t, useGroupPanels } from 'tailchat-shared';
import { useGroupIdContext } from '@/context/GroupIdContext';

const { Option } = Select;

interface GroupPanelSelectorProps {
  className?: string;
  style?: React.CSSProperties;
  value: string;
  onChange: (value: string) => void;
  groupId?: string;
  panelType?: GroupPanelType;
}

/**
 * 群组面板选择器
 */
export const GroupPanelSelector: React.FC<GroupPanelSelectorProps> = React.memo(
  (props) => {
    const contextGroupId = useGroupIdContext();
    const groupId = props.groupId ?? contextGroupId;
    const panelType = props.panelType ?? GroupPanelType.TEXT;
    const panels = useGroupPanels(groupId);

    const filteredPanels = useMemo(
      () => panels.filter((panel) => panel.type === panelType),
      [panels, panelType]
    );

    return (
      <Select
        className={props.className}
        style={props.style}
        placeholder={t('请选择面板')}
        value={props.value}
        onChange={props.onChange}
      >
        {filteredPanels.map((p) => (
          <Option key={p.id} value={p.id}>
            {p.name}
          </Option>
        ))}
      </Select>
    );
  }
);
GroupPanelSelector.displayName = 'GroupPanelSelector';
