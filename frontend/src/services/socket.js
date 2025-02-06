import { io } from 'socket.io-client';

const socket = io('http://192.168.1.105:3000');

socket.on('connect', () => {
  console.log('✅ Connection succesfull! Socket ID:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('❌ Connection error:', err);
});

export default socket;
