import React from 'react';
import { Outlet } from 'react-router-dom';
import Leftsidebar from './Leftsidebar.jsx';


function MainPage() {
  return (
    <div>
      <Leftsidebar/>    
      <div>
        <Outlet/>
      </div>
    </div>
  );
}

export default MainPage;