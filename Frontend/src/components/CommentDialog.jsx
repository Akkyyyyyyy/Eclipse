import React, { useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { formatDistanceToNow } from 'date-fns'
import Comment from './Comment.jsx'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice'

function CommentDialog({ open, setOpen }) {
  const [text, setText] = useState("");
  const {selectedPost, posts} = useSelector(store=>store.post);
  // const {posts} = useSelector(store=>store.post);
  const dispatch = useDispatch();
  const [localComments, setLocalComments] = useState([])

  useEffect(() => {
    setLocalComments(selectedPost?.comments || [])
  }, [selectedPost])
  const changeEventHandler=(e)=>{
    const inputText = e.target.value;

    if(inputText.trim()){
      setText(inputText);
    }else{
      setText("");
    }
  }

  const sendMessageHandler = async() => {
    try {
      const res = await axios.post(
        `${process.env.URL}api/v2/post/${selectedPost?._id}/comment`, 
        { text }, 
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        
        // 1. Update local state immediately for real-time UI update
        setLocalComments(prev => [res.data.comment,...prev])
        
        // 2. Update Redux store to maintain data consistency
        const updatedPostData = posts.map(p => 
          p._id === selectedPost._id 
            ? { ...p, comments: [res.data.comment, ...p.comments] } 
            : p
        )
        
        dispatch(setPosts(updatedPostData))
        setText("")
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} className='min-w-2xl p-0 flex flex-col bg-gray-900'>
        <div className='flex flex-1 w-2xl'>
          <div className='w-1/2 h-2xl'>
            <img src={selectedPost?.image} alt='' className='w-full h-full object-cover rounded-l-lg' />
          </div>
          <div className='w-1/2 flex flex-col justify-between bg-gray-900'>
            <div className='flex item-center justify-between p-4'>
              <div className='flex gap-3 items-center'>
                <Link>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={selectedPost?.author?.profilepicture} className="w-full h-full object-cover" />
                    <AvatarFallback className="bg-gray-600 text-white">
                                {selectedPost?.author?.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-sm text-white">{selectedPost?.author?.username}</Link>
                   <p className='text-sm text-white mt-1'>{selectedPost?.caption}</p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer text-gray-300 hover:text-white" size={20} />
                </DialogTrigger>
                
               
                <DialogContent className="p-0 rounded-lg max-w-xs bg-gray-800 border-gray-700 items-center">
                  <Button variant='ghost' className="w-full justify-start rounded-none py-3 text-[#ed4956] hover:bg-gray-700">Unfollow</Button>
                  <Button variant='ghost' className="w-full justify-start rounded-none py-3 text-white hover:bg-gray-700">Add to Favorites</Button>
                  <Button variant='ghost' className="w-full justify-start rounded-none py-3 text-white hover:bg-gray-700">Go to post</Button>
                  <Button variant='ghost' className="w-full justify-start rounded-none py-3 text-white hover:bg-gray-700">Share to...</Button>
                  <Button variant='ghost' className="w-full justify-start rounded-none py-3 text-white hover:bg-gray-700">Copy link</Button>
                  <Button variant='ghost' className="w-full justify-start rounded-none py-3 text-white hover:bg-gray-700">Cancel</Button>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className='flex-1 overflow-y-auto max-h-96 p-4 scrollbar-hide bg-gray-900'>
                {localComments.map((comment) => (
                  <Comment key={comment._id} comment={comment} /> 
                ))}
            </div>
            <div className='p-4'>
              <div className='flex items-center gap-2'>
                <input type="text" placeholder='Add a Comment' value={text} onChange={changeEventHandler}className='w-full outline-none border border-gray-800 p-2 rounded'/>
                <Button variant="outline" onClick={sendMessageHandler} disabled={!text.trim()}>Post</Button>
              </div>
            </div>
          </div>
        </div>


      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog