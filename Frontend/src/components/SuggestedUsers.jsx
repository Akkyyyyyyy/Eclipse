import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { Skeleton } from "@/components/ui/skeleton";
import axios from 'axios';
import { setAuthUser, setUserProfile } from '@/redux/authSlice';

const SuggestedUsers = () => {
  const { suggestedUser } = useSelector(store => store.auth);
  const { user } = useSelector(store => store.auth);
  const { userProfile } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleFollow = async (suserId) => { 
    try {
      setIsLoading(true);
      const response = await axios.post(
        `https://eclipse0.onrender.com/api/v2/user/followorUnfollow/${suserId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      if (response.data.success) {
        const updatedUser = { ...user };
        const isCurrentlyFollowing = updatedUser.following.includes(suserId);
        
        if (isCurrentlyFollowing) {
          updatedUser.following = updatedUser.following.filter(id => id !== suserId);
        } else {
          updatedUser.following = [...(updatedUser.following || []), suserId];
        }
        
        dispatch(setAuthUser(updatedUser));

        const updatedSuggestedUsers = suggestedUser.map(user => {
          if (user._id === suserId) {
            return {
              ...user,
              followers: isCurrentlyFollowing 
                ? user.followers.filter(id => id !== user._id)
                : [...(user.followers || []), user._id]
            };
          }
          return user;
        });

        if (userProfile && userProfile._id === suserId) {
          const updatedProfile = {
            ...userProfile,
            followers: isCurrentlyFollowing
              ? userProfile.followers.filter(id => id !== user._id)
              : [...(userProfile.followers || []), user._id]
          };
          dispatch(setUserProfile(updatedProfile));
        }
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='my-10'> 
      {isLoading ? (
        <div className="flex gap-3 items-center p-2 rounded-lg">
          <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-800" />
        </div>
      ) : ( 
        <div className='flex justify-between text-xs'> 
          <h1 className='font-semibold text-gray-600'>Suggested for you</h1> 
          <span className='font-medium cursor-pointer'>See All</span> 
        </div>
      )}

      {isLoading ? (
        <div className="flex gap-3 items-center p-2 rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-800" />
            <Skeleton className="h-3 w-32 bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      ) : ( 
        suggestedUser.map((suser, index) => (
          <div key={index} className="flex justify-between p-2 rounded-lg mt-0.5">
            <Link to={`profile/${suser?._id}`} className='flex gap-3 items-center'>
              <Avatar className="h-10 w-10">
                <AvatarImage src={suser?.profilepicture} alt="Profile" className="w-full h-full object-cover"/>
                <AvatarFallback className="bg-gray-600 text-white">
                  {suser?.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-semibold text-sm dark:text-white">
                  {suser?.username}
                </h1>
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  {suser?.bio}
                </span>
              </div>
            </Link>
            <button 
              onClick={() => handleFollow(suser?._id)} 
              className='text-blue-600 top-0 px-2 mt-0 text-xs font-semibold cursor-pointer'
            >
              {user?.following?.includes(suser?._id) ? 'Following' : 'Follow'}
            </button>
          </div>
        ))
      )}
    </div>  
  )
}

export default SuggestedUsers;