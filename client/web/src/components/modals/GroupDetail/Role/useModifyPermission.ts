import { useEffect, useMemo, useState } from 'react';
import _isEqual from 'lodash/isEqual';

/**
 * 权限编辑
 */
export function useModifyPermission(originPermission: string[]) {
  const [editingPermission, setEditingPermission] = useState<string[]>([]);
  const isEditing = useMemo(
    () => !_isEqual(new Set(originPermission), new Set(editingPermission)),
    [originPermission, editingPermission]
  );

  useEffect(() => {
    setEditingPermission([...originPermission]);
  }, [originPermission]);

  return {
    isEditing,
    editingPermission,
    setEditingPermission,
  };
}
