import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
import { WebhookReceiver } from 'livekit-server-sdk';
import express from 'express';
import { callBrokerAction } from './broker';
const app = express();

console.log(path.resolve(__dirname, '../../../.env'));

if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
  console.error(
    'Required env LIVEKIT_API_KEY and LIVEKIT_API_SECRET from livekit'
  );
  process.exit(1);
}

const port = process.env.LIVEKIT_WEBHOOK_PORT || 11008;

app.use(express.raw({ type: 'application/webhook+json' }));

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

app.post('/livekit/webhook', (req, res) => {
  // event is a WebhookEvent object
  try {
    const event = receiver.receive(req.body, req.get('Authorization'));

    callBrokerAction('plugin:com.msgbyte.livekit.webhook', event);
  } finally {
    res.json({ result: true });
  }
});

app.listen(port, () => {
  console.log(`Livekit Webhook Server is running on port ${port}`);
});
