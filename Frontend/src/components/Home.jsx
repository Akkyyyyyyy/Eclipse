import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import Rightsidebar from './Rightsidebar'
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