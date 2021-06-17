import { io } from 'socket.io-client';

const socket = io('http://127.0.0.1:3000', {
  transports: ['websocket'],
  forceNew: true,
});

// client-side
socket.on('connect', () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx

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
