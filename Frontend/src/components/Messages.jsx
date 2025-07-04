import useGetAllMessage from '@/hooks/useGetAllMessage';
import useGetRealTimeMessages from '@/hooks/useGetRealTimeMessages';
import React, { useEffect, useRef } from "react";
import { useSelector } from 'react-redux';

const Messages = () => {
    useGetRealTimeMessages();
    const { messages } = useSelector(store => store.chat);
    const { user, selectedUser } = useSelector(store => store.auth);;
    useGetAllMessage();

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });

    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className='flex flex-col space-y-3 p-4 pr-8 overflow-y-auto h-full'>
            {messages?.length > 0 ? (
                <>
                    {messages
                        .filter(message =>
                            message?.senderId === selectedUser?._id ||
                            message?.receiverId === selectedUser?._id
                        )
                        .map((message) => (
                            <div
                                key={message?._id}
                                className={`flex flex-col ${message?.senderId === user._id
                                        ? 'items-end'
                                        : 'items-start'
                                    }`}
                            >
                                <div
                                    className={`px-4 py-1.5 max-w-xs rounded-full text-lg ${message?.senderId === user._id
                                            ? 'bg-blue-600'
                                            : 'bg-gray-700'
                                        }`}
                                >
                                    {message?.message}
                                </div>
                                <span className="text-xs text-gray-400 mt-1">
                                    {formatTime(message?.createdAt)}
                                </span>
                            </div>
                        ))
                    }
                    <div ref={messagesEndRef} />
                </>
            ) : (
                <div className="text-center text-gray-500">
                    No messages yet. Start the conversation!
                </div>
            )}
        </div>
    );
};

export default Messages;