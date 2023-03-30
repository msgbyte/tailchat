import { parseUrlStr } from 'tailchat-shared';

/**
 * 加载图片
 */
async function loadImage(url: string): Promise<HTMLImageElement> {
  const el = document.createElement('img');
  return new Promise((resolve, reject) => {
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = parseUrlStr(url);
    el.crossOrigin = 'Anonymous';
  });
}

/**
 * 获取图片的主要颜色
 */
export async function fetchImagePrimaryColor(imageUrl: string) {
  const img = await loadImage(imageUrl);
  const canvas = document.createElement('canvas');

  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;

  for (let row = 0; row < imageData.height; row++) {
    for (let col = 0; col < imageData.width; col++) {
      r += imageData.data[(imageData.width * row + col) * 4];
      g += imageData.data[(imageData.width * row + col) * 4 + 1];
      b += imageData.data[(imageData.width * row + col) * 4 + 2];
      a += imageData.data[(imageData.width * row + col) * 4 + 3];
    }
  }

  const sum = imageData.width * imageData.height;
  r = Math.round(r / sum);
  g = Math.round(g / sum);
  b = Math.round(b / sum);
  a = Math.round(a / sum);

  return {
    r,
    g,
    b,
    a,
  };
}
