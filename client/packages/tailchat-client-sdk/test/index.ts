import { TailchatWsClient } from '../src';

const HOST = process.env.HOST;
const APPID = process.env.APPID;
const APPSECRET = process.env.APPSECRET;

if (!HOST || !APPID || !APPSECRET) {
  console.log('require env: HOST, APPID, APPSECRET');
  process.exit(1);
}

const client = new TailchatWsClient(HOST, APPID, APPSECRET);

client.connect().then(async () => {
  console.log('Login Success!');

  client.onMessage((message) => {
    console.log('Receive message', message);
  });
});
