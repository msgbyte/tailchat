import { initNotify } from './notify';

if ('Notification' in window) {
  initNotify();
} else {
  console.warn('浏览器不支持 Notification');
}
