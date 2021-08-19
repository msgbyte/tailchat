import _get from 'lodash/get';

/**
 * 传入一个图片文件， 返回对应的 Base64 编码
 * @param img 图片文件
 */
export function fileToDataUrl(img: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(String(reader.result ?? '')));
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsDataURL(img);
  });
}

/**
 * 传入文件并返回该文件的内容
 * @param file 文件对象
 */
export function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(String(reader.result ?? '')));
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsText(file);
  });
}

/**
 * 根据一个BlobUrl地址获取相应的Blob对象
 * @param blobUrl blobUrl 地址，由URL.createObjectURL方法生成
 */
export function blobFromUrl(blobUrl: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.responseType = 'blob';
    req.onload = () => {
      resolve(req.response);
    };
    req.onerror = () => {
      reject(req.responseText);
    };
    req.open('get', blobUrl);
    req.send();
  });
}

/**
 * Blob对象转文件对象
 * @param blob Blob对象
 * @param fileName 文件名
 */
export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, {
    lastModified: new Date().valueOf(),
    type: blob.type,
  });
}

/**
 * blobUrl 转 文件对象
 * @param blobUrl blobUrl
 * @param fileName 文件名
 */
export async function blobUrlToFile(
  blobUrl: string,
  fileName = 'image.jpg'
): Promise<File> {
  const blob = await blobFromUrl(blobUrl);
  return blobToFile(blob, fileName);
}

/**
 * 下载Bloburl
 */
export async function downloadBlobUrl(blobUrl: string, fileName: string) {
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = fileName; // 这里填保存成的文件名
  a.click();
}

/**
 * 下载Blob文件
 */
export async function downloadBlob(blob: Blob, fileName: string) {
  const url = String(URL.createObjectURL(blob));
  downloadBlobUrl(url, fileName);
  URL.revokeObjectURL(url);
}

/**
 * 打开一个选择文件的窗口, 并返回文件
 */
interface FileDialogOptions {
  accept?: string;
}
export async function openFile(
  fileDialogOptions?: FileDialogOptions
): Promise<File | null> {
  return new Promise((resolve) => {
    const fileEl = document.createElement('input');
    fileEl.setAttribute('type', 'file');
    if (typeof fileDialogOptions?.accept === 'string') {
      fileEl.accept = fileDialogOptions.accept;
    }
    fileEl.addEventListener('change', function (e) {
      const file: File | null = _get(this, ['files', 0], null);
      resolve(file);

      fileEl.remove();
    });

    fileEl.click();
  });
}
