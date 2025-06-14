// hooks/useSocket.js
import { io } from "socket.io-client";

let socket;

export const useSocket = () => {
  if (!socket && typeof window !== "undefined") {
    socket = io("http://localhost:8000"); // Initialize once
  }
  return socket;
};