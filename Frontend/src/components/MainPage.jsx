import React from 'react'
import { Outlet } from 'react-router-dom'
import Leftsidebar from './LeftSidebar'


function MainPage() {
  return (
    <div className=''>
      <Leftsidebar/>    
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default MainPage