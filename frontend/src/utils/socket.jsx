import io from 'socket.io-client';

// Create a single shared socket connection instance
const socket = io("https://linkedin-backend-l8rc.onrender.com", {
  withCredentials: true,
  autoConnect: false
});

export default socket;
