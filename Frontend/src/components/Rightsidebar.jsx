import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import SuggestedUsers  from './SuggestedUsers';

function Rightsidebar() {
  const { user } = useSelector(store => store.auth)
  return (
    <div>
      <div className='hidden md:block fixed inset-y-0 right-0 z-30 flex-col h-screen p-4 w-72 border-l bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800'>
        <Link to={`profile/${user?._id}`}>
      <div className="flex gap-3 items-center p-2 rounded-lg">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.profilePicture} alt="Profile"  className="w-full h-full object-cover"/>
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
      </div>
      </Link>
    <SuggestedUsers/>

    </div>
    </div>
    
  )
}

export default Rightsidebar