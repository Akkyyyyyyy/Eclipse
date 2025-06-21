import React from 'react'

const NoChat = () => {
  return (
    <div className='flex flex-col justify-center items-center text-center h-screen bg-gray-900'>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v11a2 2 0 01-2 2h-5l-7 7v-7a2 2 0 01-2-2z" />
      </svg>
      <h3 className='mt-4 text-lg font-medium text-gray-600 dark:text-gray-400'>No chat selected</h3>
      <p className='mt-2 text-gray-500 dark:text-gray-500'>Select a chat to start messaging</p>
    </div>


  )
}

export default NoChat