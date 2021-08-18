import { request } from '../api/request';

interface UploadFileOptions {
  onProgress?: (percent: number, progressEvent: unknown) => void;
}
interface UploadFileResult {
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

  const { data } = await request.post('/file/v2/image/upload', form, {
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
}
