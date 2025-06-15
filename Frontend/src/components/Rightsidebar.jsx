import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import SuggestedUsers  from './SuggestedUsers.jsx';
import { Skeleton } from "@/components/ui/skeleton";

function Rightsidebar() {
  const { user } = useSelector(store => store.auth)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  
  return (
    <div>
      <div className='hidden md:block fixed inset-y-0 right-0 z-30 flex-col h-screen p-4 w-72 border-lW dark:from-gray-900'>
      {isLoading ? (
        <div className="flex gap-3 items-center p-2 rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-800" />
            <Skeleton className="h-3 w-32 bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      ) : (  <Link to={`profile/${user?._id}`}>
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
      </Link> )}
    <SuggestedUsers/>

    </div>
    </div>
    
  )
}

export default Rightsidebar