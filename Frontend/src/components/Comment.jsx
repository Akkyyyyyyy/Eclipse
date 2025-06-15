import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { formatDistanceToNow } from 'date-fns'

const formatShortDate = (date) => {
  if (!date || isNaN(new Date(date))) return ''

  const distance = formatDistanceToNow(new Date(date), { 
    addSuffix: false,
    includeSeconds: true
  })

  if (distance.includes('less than') || distance.includes('seconds') || distance.includes('half')) {
    return 'just now'
  }

  const cleanDistance = distance.replace(/^about /, '')
  const parts = cleanDistance.split(' ')
  const value = parts[0]
  const unit = parts[1][0]

  return `${value}${unit}`
}

const Comment = ({ comment }) => {
  return (
    <div key={comment?._id} className="flex gap-3 p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
      <Link 
        to={`/profile/${comment?.author?.username}`}
        className="flex-shrink-0 hover:opacity-80 transition-opacity"
      >
        <Avatar className="w-9 h-9 border border-gray-600">
          <AvatarImage 
            src={comment?.author?.profilepicture} 
            className="object-cover" 
          />
          <AvatarFallback className="bg-gray-600 text-white">
            {comment?.author?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <Link 
              to={`/profile/${comment.author?.username}`}
              className="font-medium text-sm text-white hover:underline truncate"
            >
              {comment.author?.username}
            </Link>
          </div>
          {comment?.createdAt && !isNaN(new Date(comment?.createdAt)) && (
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {formatShortDate(comment?.createdAt)}
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-100 mt-1 break-words">
          {comment?.text}
        </p>
        
        {/* <div className="flex gap-4 mt-2">
          <button className="text-xs text-gray-400 hover:text-white transition-colors">
            Like
          </button>
          <button className="text-xs text-gray-400 hover:text-white transition-colors">
            Reply
          </button>
        </div> */}
      </div>
    </div>
  )
}

export default Comment