import { useCallback, useEffect, useMemo, useState } from 'react';
import _isEqual from 'lodash/isEqual';
import _uniq from 'lodash/uniq';
import _without from 'lodash/without';

/**
 * 权限编辑
 */
export function useModifyPermission(originPermission: string[]) {
  const [editingPermission, setEditingPermission] = useState<string[]>([]);
  const isEditing = useMemo(
    () => _isEqual(new Set(originPermission), new Set(editingPermission)),
    [originPermission, editingPermission]
  );

  useEffect(() => {
    setEditingPermission([...originPermission]);
  }, [originPermission]);

  const handleSwitchPermission = useCallback(
    (permissionKey: string, enabled: boolean) => {
      if (enabled) {
        setEditingPermission(_uniq([...editingPermission, permissionKey]));
      } else {
        setEditingPermission(_without(editingPermission, permissionKey));
      }
    },
    [editingPermission]
  );

  return { isEditing, editingPermission, handleSwitchPermission };
}
