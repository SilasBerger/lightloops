import { io } from 'socket.io-client';

export enum IoEvent {
    NEW_RECORD = 'NEW_RECORD',
    CHANGED_RECORD = 'CHANGED_RECORD',
    DELETED_RECORD = 'DELETED_RECORD',
    CONNECTED_CLIENTS = 'CONNECTED_CLIENTS'
}

const socket = io('http://localhost:3005?apiKey=web_api_key_4321');

socket.on("connect", () => {
    console.log(`Socket connected with ID ${socket.id}.`);
  });
  
socket.on('disconnect', () => {
    console.log(`Socket with ID ${socket.id} disconnected.`);
});

socket.on('connect_error', (error) => {
    if (socket.active) {
      console.log('Temporary error; socket will try to reconnect.');
    } else {
      console.log(error.message);
    }
});

socket.on(IoEvent.NEW_RECORD, (data) => {
    console.log(data);
});
