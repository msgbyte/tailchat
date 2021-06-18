import { io } from 'socket.io-client';

const uri = 'http://127.0.0.1:3000';
const options = {
  transports: ['websocket'],
  forceNew: true,
  auth: {
    token: 'just for test',
  },
};

for (let i = 0; i < 100; i++) {
  const socket = io(uri, options);

  // client-side
  socket.on('connect', () => {
    console.log(`[${i}]`, socket.id); // x8WIv7-mJelg7on_ALbx

    socket.emit('aaa', 'ddd');
  });

  socket.on('disconnect', () => {
    console.log(socket.id); // undefined
  });

  socket.on('connect_error', (err) => {
    console.log('connect_error', err.message);
  });

  socket.io.on('error', () => {
    console.log('error');
  });

  socket.onAny((eventName: string, eventData: unknown) => {
    console.log(`[${i}]`, {
      eventName,
      eventData,
    });
  });
}
