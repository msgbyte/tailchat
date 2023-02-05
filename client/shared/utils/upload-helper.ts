import { showToasts, t } from '..';
import { request } from '../api/request';
import _get from 'lodash/get';
import { getGlobalConfig } from '../model/config';
import { showErrorToasts } from '../manager/ui';
import filesize from 'filesize';

interface UploadFileOptions {
  onProgress?: (percent: number, progressEvent: unknown) => void;
}
export interface UploadFileResult {
  etag: string;
  path: string;
  url: string;
}

/**
 * 上传文件
 */
export async function uploadFile(
  file: File,
  options: UploadFileOptions = {}
): Promise<UploadFileResult> {
  const form = new FormData();
  form.append('file', file);

  const uploadFileLimit = getGlobalConfig().uploadFileLimit;
  if (file.size > uploadFileLimit) {
    // 文件过大
    showErrorToasts(
      `${t('上传失败, 支持的文件最大大小为:')} ${filesize(uploadFileLimit, {
        base: 2,
      })}`
    );
    throw new Error('File Too Large');
  }

  try {
    const { data } = await request.post('/upload', form, {
      onUploadProgress(progressEvent) {
        if (progressEvent.lengthComputable) {
          if (typeof options.onProgress === 'function') {
            options.onProgress(
              progressEvent.loaded / progressEvent.total,
              progressEvent
            );
          }
        }
      },
    });

    return data;
  } catch (e) {
    showToasts(`${t('上传失败')}: ${t('可能是文件体积过大')}`, 'error');
    console.error(`${t('上传失败')}: ${_get(e, 'message')}`);
    throw e;
  }
}
