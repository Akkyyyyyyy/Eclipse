import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: ["GET", "POST"],
        credentials: true
    }
});

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

io.on("connection", (socket) => {
    // console.log(`socket ${socket.id} connected`);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`Connected userId: ${userId}, socketId: ${socket.id}`);

    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        // console.log(`socket ${socket.id} disconnected due to ${reason}`);
        if (userId) {
            delete userSocketMap[userId];
            console.log(`Disconnected userId: ${userId}, socketId: ${socket.id}`);

        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap)); // Emit the updated online users list
    });
});

// server.listen(3000, () => {
//     console.log("Server started on port 3000");
// });

export { app, server, io };