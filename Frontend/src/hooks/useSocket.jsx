// hooks/useSocket.js
import { io } from "socket.io-client";

let socket;

export const useSocket = () => {
  if (!socket && typeof window !== "undefined") {
    socket = io("${process.env.URL}/"); // Initialize once
  }
  return socket;
};