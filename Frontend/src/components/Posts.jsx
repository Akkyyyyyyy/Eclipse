import React from 'react'
import Post from './Post.jsx'
import { useSelector } from 'react-redux'

function Posts() {
  const {posts} = useSelector(store=>store.post)
  return (
    <div className='bg-white dark:bg-gray-900 px-10 pt-14 md:pt-5 '>
        {
            posts.map((post)=><Post key={post._id} post={post}/>)
        }
    </div>
  )
}

export default Posts