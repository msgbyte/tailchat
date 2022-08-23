import { app } from 'electron';

const isDev = !app.isPackaged;
const webUrl = isDev
  ? 'http://localhost:11011'
  : 'https://nightly.paw.msgbyte.com';

export const config = {
  isDev,
  webUrl,
};
