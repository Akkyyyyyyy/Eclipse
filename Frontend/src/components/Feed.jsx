import React from 'react'
import Posts from './Posts.jsx'

function Feed() {
  return (
    <div className='flex-1  flex flex-col items-center bg-white dark:bg-gray-900'>
      <Posts />
    </div>
  )
}

export default Feed