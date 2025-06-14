import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import Chat from './Chat.jsx';
import NoChat from './NoChat.jsx';

const ChatPage = () => {
    const { suggestedUser, selectedUser } = useSelector(store => store.auth);;
    const { onlineUsers } = useSelector(store => store.chat);
    const dispatch = useDispatch();

    useEffect(() =>{
        return () =>{
            dispatch(setSelectedUser(null));
        }
    },[])
    

    return (
        <div className='flex h-screen bg-gray-900 text-white'>
            {/* Sidebar - Fixed width */}
            <section className='w-80 md:ml-64 p-4 border-r border-gray-800 flex-shrink-0 '>
                {/* Header */}
                <div className='sticky top-0 bg-gray-900 pb-4 z-10'>
                    <h1 className='font-bold text-xl mb-4 py-1'>Inbox</h1>
                    <hr className='border-gray-700' />
                </div>

                {/* Users List */}
                <div className='overflow-y-auto h-[calc(100vh-120px)] pr-2'>
                    {suggestedUser.map((suggested) => {
                        const isOnline = onlineUsers.includes(suggested._id);
                        return (
                            <div
                                onClick={() => dispatch(setSelectedUser(suggested))}
                                key={suggested._id}
                                className='flex gap-3 items-center p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors duration-200'
                            >
                                <div className='relative'>
                                    <Avatar className='w-10 h-10'>
                                        <AvatarImage
                                            src={suggested?.profilepicture}
                                            alt={`${suggested.username}'s profile`}
                                            className='w-full h-full object-cover'
                                        />
                                        <AvatarFallback className='bg-gray-600'>
                                            {suggested?.username?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isOnline && (
                                        <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-600 rounded-full border-2 border-gray-900'></span>
                                    )}
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <span className='font-medium block truncate'>
                                        {suggested?.username}
                                    </span>
                                    {isOnline && (
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                                            Online
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {suggestedUser.length === 0 && (
                        <div className='text-center text-gray-400 py-8'>
                            No suggested users found
                        </div>
                    )}
                </div>
            </section>

            {/* Main Chat Area */}
            <div className='flex-1 bg-gray-900'>
                {selectedUser ? <Chat /> : <NoChat />}
            </div>
        </div>
    )
}

export default ChatPage;