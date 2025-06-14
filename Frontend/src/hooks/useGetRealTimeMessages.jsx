import React, {useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '@/redux/chatSlice';
import { useSocket } from './useSocket';

const useGetRealTimeMessages = () => {
  const dispatch = useDispatch();
//   const socket = useSocket();
const {socket} = useSelector(store => store.socket);
  const {messages} = useSelector(store => store.chat);
    useEffect(()=>{
        socket?.on('newMessage', (message) => {
            console.log(message);
            
            dispatch(setMessages([...messages, message]));
        })
        return () => {
            socket?.off('newMessage');
        }
    },[messages, setMessages, dispatch, socket])
}

export default useGetRealTimeMessages