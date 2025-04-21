import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io("https://treasuretracker.onrender.com", {
  reconnection: true,
  reconnectionAttempts: 20,
  reconnectionDelay: 500,
  reconnectionDelayMax: 1000,
  randomizationFactor: 0
});

socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

export default socket;
