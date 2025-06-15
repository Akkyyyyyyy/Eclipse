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
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { FaHeart, FaRegBookmark, FaRegCommentAlt, FaRegHeart } from 'react-icons/fa'
import { IoIosSend } from 'react-icons/io'

function CommentDialog({ open, setOpen }) {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector(store => store.post);
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
  const [localComments, setLocalComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(0);

  useEffect(() => {
    setLocalComments(selectedPost?.comments || []);
    setLiked(selectedPost?.likes.includes(user?._id) || false);
    setPostLikes(selectedPost?.likes.length || 0);
  }, [selectedPost, user?._id]);
  const changeEventHandler = (e) => {
    const inputText = e.target.value;

    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }

  // const sendMessageHandler = async () => {
  //   try {
  //     const res = await axios.post(
  //       `https://eclipse0.onrender.com/api/v2/post/${selectedPost?._id}/comment`,
  //       { text },
  //       {
  //         headers: { 'Content-Type': 'application/json' },
  //         withCredentials: true
  //       }
  //     )

  //     if (res.data.success) {
  //       toast.success(res.data.message)

  //       // 1. Update local state immediately for real-time UI update
  //       setLocalComments(prev => [res.data.comment, ...prev])

  //       // 2. Update Redux store to maintain data consistency
  //       const updatedPostData = posts.map(p =>
  //         p._id === selectedPost._id
  //           ? { ...p, comments: [res.data.comment, ...p.comments] }
  //           : p
  //       )

  //       dispatch(setPosts(updatedPostData))
  //       setText("")
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const likeOrDislikeHandler = async () => {

    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(`https://eclipse0.onrender.com/api/v2/post/${selectedPost._id}/${action}`, {
        withCredentials: true
      });
    console.log("here");

      if (res.data.success) {
        const updatedLikes = liked ? postLikes - 1 : postLikes + 1;
        setPostLikes(updatedLikes);
        setLiked(!liked);
        // toast.success(res.data.message);
        const updatedPostData = posts.map(
          (p) => p._id === selectedPost._id ? {
            ...p,
            likes: liked ? p.likes.filter((id) => id !== user._id) : [...p.likes, user._id]
          } : p
        );
        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      //   toast.error(error.response.data.message);
    }
  }
  const commentHandler = async () => {
    try {
      const res = await axios.post(`https://eclipse0.onrender.com/api/v2/post/${selectedPost._id}/comment`, { text }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedCommentData = [res.data.comment, ...comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(
          (p) => p._id === selectedPost._id ? {
            ...p,
            comments: updatedCommentData
          } : p
        );
        dispatch(setPosts(updatedPostData));
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  }
  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`https://eclipse0.onrender.com/api/v2/post/${selectedPost._id}/bookmark`, {
        withCredentials: true
      });

      if (res.data.success) {
        // setBookmark(!bookmark);
        toast.success(res.data.message);

        const updatedPostData = posts.map(
          (p) => p._id === selectedPost._id ? {
            ...p,
            bookmarks: res.data.type === 'saved' ? [...p.bookmarks, user._id] : p.bookmarks.filter((id) => id !== user._id)
          } : p
        );
        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      console.log(error);
    }
  }
  const formatDate = (date) => {
  if (!date || isNaN(new Date(date))) return ''

  const distance = formatDistanceToNow(new Date(date), { 
    addSuffix: true,
    includeSeconds: true
  })

  if (distance.includes('less than') || distance.includes('seconds') || distance.includes('half')) {
    return 'just now'
  }

  // const cleanDistance = distance.replace(/^about /, '')
  // const parts = cleanDistance.split(' ')
  // const value = parts[0]
  // const unit = parts[1][0]

  // return `${value}${unit}`
  return distance
}
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} className='min-w-2xl p-0 flex flex-col bg-gray-900'>
        <div className='flex flex-1 w-2xl'>
          <div className='w-5/11 h-2xl'>
            <img src={selectedPost?.image} alt='' className='w-full h-full object-cover rounded-l-lg' />
          </div>
          <div className='w-6/11 flex flex-col justify-between bg-gray-900'>
            <div className='flex item-center justify-between p-4'>
              <div className='flex gap-3 px-3 items-center'>
                <Link>
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={selectedPost?.author?.profilepicture} className="w-full h-full object-cover" />
                    <AvatarFallback className="bg-gray-600 text-white">
                      {selectedPost?.author?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                    
                  </Avatar>
                </Link>
                <div>
                  <div className="text-sm text-white">
                {selectedPost?.author?.username && (
                  <>     <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Link 
                                to={`/profile/${selectedPost?.username}`}
                                className="font-medium text-sm text-white hover:underline truncate"
                              >
                                {selectedPost?.author?.username}
                              </Link>
                            </div>
                            
                          </div>
                          
                          <p className="text-sm text-gray-100 mt-1 break-words">
                            {selectedPost?.caption}
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
                    {/* <Link className="font-semibold text-sm text-white"><span className="font-semibold mr-1">{selectedPost.author?.username}</span></Link>
                    <p className="text-sm text-gray-100 mt-1 break-words">{selectedPost.caption}</p> */}
                  </>
                )}
              </div>
                </div>
              </div>
              
            </div>
            <hr />
            <div className='flex-1 overflow-y-auto max-h-64 p-4 scrollbar-hide bg-gray-900'>
              {localComments.length > 0 ? localComments.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              )):(
                <div className="text-center text-sm  text-gray-500">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>

            <div className="pt-4 p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex gap-4">
                  <button onClick={likeOrDislikeHandler} className="text-2xl text-white hover:text-gray-300 cursor-pointer">
                    {
                      liked ? <FaHeart className="text-red-500 " /> : <FaRegHeart />
                    }
                  </button>
                  <button className="text-2xl text-white hover:text-gray-300 cursor-pointer"  >               
                    <FaRegCommentAlt />
                  </button>
                  <button className="text-2xl text-white hover:text-gray-300">
                    <IoIosSend />
                  </button>
                </div>
                <button onClick={bookmarkHandler} className="text-2xl text-white hover:text-gray-300">
                  <FaRegBookmark />
                </button>
              </div>

              {/* Likes */}
              <div className="text-sm font-semibold mb-1 text-white">{postLikes} likes</div>

{selectedPost?.createdAt && !isNaN(new Date(selectedPost?.createdAt)) && (
                              <span className="text-sm text-gray-400 whitespace-nowrap">
                                {formatDate(selectedPost?.createdAt)}
                              </span>
                            )}
              {/* Caption */}
              
<div className=" pt-3 flex items-center">
              <input
                type="text"
                placeholder="Add a comment..."
                value={text}
                onChange={changeEventHandler}
                className="flex-1 text-sm outline-none bg-transparent text-white placeholder-gray-400"
              />
              {
                text && <button onClick={commentHandler} className="text-blue-400 font-semibold text-sm hover:text-blue-300">Post</button>
              }

            </div>
              {/* Comments */}
             
              {/* <CommentDialog open={open} setOpen={setOpen}  commentHandler={commentHandler}/> */}

            </div>

            {/* Add comment */}
            
            {/* <div className='p-4'>
              <div className='flex items-center gap-2'>
                <input type="text" placeholder='Add a Comment' value={text} onChange={changeEventHandler}className='w-full outline-none border border-gray-800 p-2 rounded'/>
                <Button variant="outline" onClick={sendMessageHandler} disabled={!text.trim()}>Post</Button>
              </div>
            </div> */}
          </div>
        </div>


      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog