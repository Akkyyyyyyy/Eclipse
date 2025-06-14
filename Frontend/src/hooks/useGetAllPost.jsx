import React, {useEffect } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const useGetAllPost = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllPost = async () =>{
            try {
                  const res = await axios.get('https://eclipse0.onrender.com//api/v2/post/all',{
  withCredentials: true
})
                  if(res.data.success){
                    console.log(res.data);
                    dispatch(setPosts(res.data.posts));
                  }
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchAllPost();
    },[])
}
export default useGetAllPost;