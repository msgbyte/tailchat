/**
 * 打开一个全屏的video
 */
export async function openFullScreenVideo(src: string) {
  return new Promise<void>((resolve, reject) => {
    const containerEl = document.createElement('div');
    containerEl.style.position = 'fixed';
    containerEl.style.height = '100vh';
    containerEl.style.width = '100vw';
    containerEl.style.left = '0px';
    containerEl.style.top = '0px';
    containerEl.style.zIndex = '99999';
    containerEl.style.backgroundColor = '#000000';
    containerEl.style.display = 'flex';
    containerEl.style.alignItems = 'center';
    containerEl.style.justifyContent = 'center';

    const videoEl = document.createElement('video');
    videoEl.src = src;

    videoEl.autoplay = true;
    videoEl.addEventListener('ended', () => {
      containerEl.removeChild(videoEl);
      document.body.removeChild(containerEl);
      resolve();
    });
    videoEl.addEventListener('error', () => {
      reject();
    });

    containerEl.appendChild(videoEl);
    document.body.appendChild(containerEl);
  });
}
