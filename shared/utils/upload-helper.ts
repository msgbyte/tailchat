import { showToasts, t } from '..';
import { request } from '../api/request';
import _get from 'lodash/get';

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
    showToasts(`${t('上传失败')}: ${_get(e, 'message')}`, 'error');
    throw e;
  }
}
