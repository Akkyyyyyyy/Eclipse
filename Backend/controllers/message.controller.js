import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { text: message } = req.body;
        console.log(message);
        
        // Find or create conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                messages: []
            });
        }

        // Create new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        // Add message to conversation
        if (newMessage) {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }

        // Socket.io notification
        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log(`Emitting to receiver ${receiverId}, ${message}`);
        io.to(receiverSocketId).emit('newMessage', newMessage);//i dont think this line is working at all

        return res.status(201).json({
            newMessage,
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        // Find conversation with messages populated
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');

        if (!conversation) {
            return res.status(200).json({
                messages: [],
                success: true
            });
        }

        return res.status(200).json({
            success: true,
            messages: conversation.messages
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}