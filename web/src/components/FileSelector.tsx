import React, { useCallback, useRef } from 'react';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';

/**
 * 文件选择器
 */

interface FileSelectorProps {
  fileProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  /**
   * 选中文件
   */
  onSelected: (files: FileList) => void;
}
export const FileSelector: React.FC<FileSelectorProps> = React.memo((props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleSelect = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleChange = useCallback(() => {
    if (_isNil(fileInputRef.current)) {
      return;
    }

    const files = fileInputRef.current.files;
    if (_isNil(files)) {
      return;
    }

    _isFunction(props.onSelected) && props.onSelected(files);
  }, [props.onSelected]);

  return (
    <div onClick={handleSelect}>
      {props.children}
      <input
        {...props.fileProps}
        className="hidden"
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
      />
    </div>
  );
});
FileSelector.displayName = 'FileSelector';
