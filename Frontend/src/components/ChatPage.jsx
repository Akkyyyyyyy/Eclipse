import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import Chat from './Chat.jsx';
import NoChat from './NoChat.jsx';

const ChatPage = () => {
    const { suggestedUser, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers } = useSelector(store => store.chat);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    }, []);

    return (
        <div className='flex h-screen bg-gray-900 text-white'>
            {/* Sidebar - Hidden on mobile when chat is open */}
            <section className={`${selectedUser ? 'hidden' : 'block'} md:block w-full md:w-80 md:ml-64 p-4 border-r border-gray-800`}>
                {/* Header with navbar - Hidden when chat is open */}
                <div className={`${selectedUser ? 'hidden' : 'block'} sticky top-0 bg-gray-900 pb-4 z-10`}>
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

            {/* Main Chat Area - Hidden on mobile unless user is selected */}
            <div className={`${selectedUser ? 'block' : 'hidden'} md:block flex-1 bg-gray-900 relative`}>
                {selectedUser ? (
                    <>
                        <Chat />
                        {/* Mobile back button - Only shown when chat is open on mobile */}
                        <button 
                            onClick={() => dispatch(setSelectedUser(null))}
                            className="md:hidden absolute top-4 left-4 z-51 p-2 rounded-full bg-gray-900 cursor-pointer transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <div className='md:hidden absolute z-50 flex items-center p-4  top-0 bg-gray-900 border-b border-gray-800 pl-15 w-full'>
                                        <div className='relative mr-3'>
                                            <Avatar className='w-10 h-10 ring-3 ring-gray-800'>
                                                <AvatarImage
                                                    src={selectedUser?.profilepicture}
                                                    alt={`${selectedUser?.username}'s profile`}
                                                    className='w-full h-full object-cover'
                                                />
                                                <AvatarFallback className='bg-gray-600 text-white'>
                                                    {selectedUser?.username?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div>
                                            <h2 className='font-semibold text-white'>{selectedUser?.username}</h2>
                                            {
                                                onlineUsers.includes(selectedUser?._id) && (<p className='text-xs text-gray-400'>Online</p>) 
                                            }
                                            {/* <p className='text-xs text-gray-400'>{selectedUser?.bio}</p> */}
                                        </div>
                                    </div>
                    </>
                ) : <NoChat />}
            </div>
        </div>
    )
}

export default ChatPage;