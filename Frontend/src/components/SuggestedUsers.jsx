import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'

const SuggestedUsers = () => {
  const {suggestedUser} = useSelector(store=>store.auth)
  // console.log(suggestedUser);
  return (
    <div className='my-10'> 
    <div className='flex  justify-between text-xs'> 
      <h1 className='font-semibold text-gray-600'>Suggested for you</h1> 
      <span className='font-medium cursor-pointer'>See All</span> 
    </div>
    {
      suggestedUser.map((user, index) => (
        <div key={index} className="p-2 rounded-lg mt-0.5">
          <Link to={`profile/${user?._id}`} className='flex gap-3 items-center'>
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.profilepicture} alt="Profile"  className="w-full h-full object-cover"/>
            <AvatarFallback className="bg-gray-600 text-white">
                        {user?.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm dark:text-white">
               {user?.username}
              </h1>
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              {user?.bio}
            </span>
          </div>
          </Link>
        </div>
      ))

    }
    </div>  
  )
}

export default SuggestedUsers