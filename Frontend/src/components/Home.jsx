import React from 'react'
import Feed from './Feed.jsx'
import { Outlet } from 'react-router-dom'
import Rightsidebar from './Rightsidebar.jsx'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUser from '@/hooks/useGetSuggestedUser'

function Home() {
  useGetAllPost();
  useGetSuggestedUser();  
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed />
        <Outlet />
      </div>
      <Rightsidebar />
    </div>
  )
}

export default Home