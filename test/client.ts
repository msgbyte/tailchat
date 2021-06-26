import { io } from 'socket.io-client';
import fetch from 'node-fetch';

const uri = 'http://127.0.0.1:11000';

function createIO(authToken: string) {
  const socket = io(uri, {
    transports: ['websocket'],
    forceNew: true,
    auth: {
      token: authToken,
    },
  });

  // client-side
  socket.on('connect', () => {
    console.log('socket.id:', socket.id); // x8WIv7-mJelg7on_ALbx

    socket.emit(
      'debug.echo',
      {
        name: 'moonrailgun',
      },
      (d) => {
        console.log(d);
      }
    );
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
    console.log({
      eventName,
      eventData,
    });
  });
}

fetch('http://127.0.0.1:11000/api/user/login', {
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'asd',
    password: 'asd',
  }),
  method: 'post',
})
  .then((res: any) => res.json())
  .then((data: any) => {
    const token = data.user.token;
    createIO(token);
  });

// createIO();
// for (let i = 0; i < 100; i++) {
//   createIO(i)
// }
