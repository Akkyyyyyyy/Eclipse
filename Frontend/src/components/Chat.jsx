import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Messages from './Messages.jsx';
import axios from 'axios';
// import { useSocket } from '@/hooks/useSocket';
import { setMessages } from '@/redux/chatSlice';

const Chat = () => {
    const { selectedUser } = useSelector(store => store.auth);
    const {onlineUsers, messages} = useSelector(store => store.chat);
    const dispatch = useDispatch();
    // const socket = useSocket();     // Use the socket from the context
    const {socket} = useSelector(store => store.socket);
    const [text, setText] = useState('');

    const sendMessageHandler = async() => {
        if(!text.trim()) return;
        try {
            const res = await axios.post(`${process.env.URL}api/v2/message/send/${selectedUser?._id}`, {text: text},{
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                withCredentials: true
            })
            if(res.data.success){
                setText('');
                // socket.emit('newMessage', res.data.newMessage);
                socket?.emit('newMessage', res.data.newMessage);
                dispatch(setMessages([...messages, res.data.newMessage]));
            }
        } catch (error) {
            console.log(error);
        }
    }

    
    return (
        <div className="bg-gray-900 h-screen flex flex-col">
            {/* Header - Sleeker sticky header */}
            <div className='flex items-center p-4 sticky top-0 bg-gray-900 border-b border-gray-800 z-10'>
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

            {/* Chat Messages Area - Better scrolling */}
            <div className='flex-1 overflow-y-auto p-4 space-y-3 bg-gray-800/50'>
                {/* Placeholder for messages */}
                {/* <div className='text-center text-gray-400 py-10'>
                    Start a new conversation with {selectedUser?.username}           
                </div> */}
                <Messages/>
            </div>

            {/* Message Input - Modern input design */}
            <div className='p-4 bg-gray-900 border-t border-gray-800'>
                <div className='flex gap-2'>
                    <input
                        value={text}
                        onChange={e => setText(e.target.value)}
                        type="text" 
                        placeholder={`Message ${selectedUser?.username}...`} 
                        className='flex-1 bg-gray-800 text-white px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                 <button onClick={sendMessageHandler}className='
  bg-gradient-to-r from-blue-500 to-blue-600
  text-white px-4 py-2 rounded-lg
  hover:from-blue-600 hover:to-blue-700
  active:scale-95 transform transition-all
  shadow-md hover:shadow-lg
  font-medium
'>
  Send
</button>
                </div>
            </div>  
        </div>
    )
}

export default Chat;