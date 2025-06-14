import React, { useEffect } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '@/redux/chatSlice';

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(store => store.auth);
  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        const res = await axios.get(`https://eclipse0.onrender.com//api/v2/message/all/${selectedUser?._id}`, {
          withCredentials: true
        })
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.log(error);

      }
    }
    fetchAllMessage();
  }, [dispatch, selectedUser, setMessages])
}

export default useGetAllMessage