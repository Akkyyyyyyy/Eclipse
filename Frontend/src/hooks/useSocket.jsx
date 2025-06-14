// hooks/useSocket.js
import { io } from "socket.io-client";

let socket;

export const useSocket = () => {
  if (!socket && typeof window !== "undefined") {
    socket = io("https://eclipse0.onrender.com"); // Initialize once
  }
  return socket;
};