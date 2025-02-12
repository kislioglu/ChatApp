import {io} from 'socket.io-client';
import auth from '@react-native-firebase/auth';
import {SOCKET_URL} from '@env';
let socket = null;

const connectSocket = () => {
  const user = auth().currentUser;

  if (user && !socket) {
    socket = io(`${SOCKET_URL}:3000`, {
      query: {uid: user.uid},
    });

    socket.on('connect', () => {
      console.log('Connection successful! Socket ID:', socket.id);
    });

    socket.on('connect_error', err => {
      console.error('Connection error:', err);
    });
  }

  return socket;
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log('Socket disconnected');
    socket = null;
  }
};

export {connectSocket, disconnectSocket};
