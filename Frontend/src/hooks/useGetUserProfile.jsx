import React, { useEffect } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserProfile } from '@/redux/authSlice';

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    // const [userProfile, setUserProfileState] = React.useState({});
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`https://eclipse0.onrender.com//api/v2/user/${userId}/profile`, {
                    withCredentials: true
                })
                if (res.data.success) {
                    // console.log(res.data);
                    // dispatch();
                    dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                console.log(error);

            }
        }
        fetchUserProfile();
    }, [userId])
}
export default useGetUserProfile;
