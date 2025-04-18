import io from 'socket.io-client';

// Create a single shared socket connection instance
const socket = io("http://localhost:8000", {
  withCredentials: true,
  autoConnect: false
});

export default socket;
