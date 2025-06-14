import React, { useEffect } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setSuggestedUser } from '@/redux/authSlice';

const useGetSuggestedUser = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUser = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/v2/user/suggested', {
                    withCredentials: true
                })
                if (res.data.success) {
                    // console.log(res.data);
                    dispatch(setSuggestedUser(res.data.users));
                }
            } catch (error) {
                console.log(error);

            }
        }
        fetchSuggestedUser();
    }, [])
}
export default useGetSuggestedUser;