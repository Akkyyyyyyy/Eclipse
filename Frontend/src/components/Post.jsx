import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegCommentAlt, FaRegHeart, FaRegShareSquare } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import CommentDialog from "./CommentDialog.jsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from '@/redux/postSlice';  // or wherever your Redux actions are
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { Badge } from "./ui/badge";


function Post({ post }) {
    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    // const [bookmark, setBookmark] = useState(user.bookmarks?.includes(post?._id) || false);
    const [postLikes, setPostLikes] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    const dispatch = useDispatch();
    // console.log(post);

    const changeEventHandler = (e) => {
        const input = e.target.value;
        if (input.trim()) {
            setText(input);
        } else {
            setText("");
        }
    }

    const deletePostHandler = async (e) => {
        e.preventDefault();
        try {
            //   setLoading(true);
            const res = await axios.delete(`${process.env.URL}api/v2/post/delete/${post?._id}`, {
                withCredentials: true
            });
            console.log(res.data);

            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem._id !== post?._id);
                dispatch(setPosts(updatedPostData));

                toast.success(res.data.message);
                // setOpen(false);  
            }
        } catch (error) {
            //   toast.error(error.response.data.message);
        }
    }
    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`${process.env.URL}/api/v2/post/${post._id}/${action}`, {
                withCredentials: true
            });

            if (res.data.success) {
                const updatedLikes = liked ? postLikes - 1 : postLikes + 1;
                setPostLikes(updatedLikes);
                setLiked(!liked);
                // toast.success(res.data.message);
                const updatedPostData = posts.map(
                    (p) => p._id === post._id ? {
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
            const res = await axios.post(`${process.env.URL}/api/v2/post/${post._id}/comment`, { text }, {
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
                    (p) => p._id === post._id ? {
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
            const res = await axios.get(`${process.env.URL}/api/v2/post/${post._id}/bookmark`, {
                withCredentials: true
            });

            if (res.data.success) {
                // setBookmark(!bookmark);
                toast.success(res.data.message);

                const updatedPostData = posts.map(
                    (p) => p._id === post._id ? {
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
    return (
        <div className="border-b border-gray-700  bg-white dark:bg-gray-900 max-w-lg mx-auto">
            {/* Post Header */}
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-2">
                    <Avatar className="w-9 h-9 border border-gray-600">
                        <AvatarImage src={post.author?.profilepicture} className="w-full h-full object-cover" />
                        <AvatarFallback className="bg-gray-600 text-white">
                                    {post.author.username.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                    </Avatar>
                    <Link  to={`/profile/${post.author._id}`} className="font-semibold text-sm text-white">{post.author?.username}</Link>
                        {    user && user._id === post.author._id && (
                           <Badge variant="outline">Owner</Badge>
                        )
}
                    <div className="text-xs text-gray-400 mt-1">
                        •
                    </div>
                    {/* Time posted */}
                    {post.createdAt && !isNaN(new Date(post.createdAt)) ? (
                        <div className="text-xs text-gray-400 mt-1">
                            {/* {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })} */}
                            {formatShortDate(post.createdAt)}
                        </div>
                    ) : null}

                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className="cursor-pointer text-gray-300 hover:text-white" size={20} />
                    </DialogTrigger>
                    <DialogContent className="p-0 rounded-lg max-w-xs bg-gray-800 border-gray-700 text-center">
                        {
                            user && user._id !== post.author._id && (
                                <Button variant='ghost' className="w-full justify-start rounded-none py-3 text-[#ed4956] hover:bg-gray-700">Unfollow</Button>

                            )
                        }
                        <Button variant='ghost' className="w-full justify-start rounded-none py-3 text-white hover:bg-gray-700">Add to Favorites</Button>
                        <Button variant='ghost' className="w-full justify-start rounded-none py-3 text-white hover:bg-gray-700">Go to post</Button>
                        <Button variant='ghost' className="w-full justify-start rounded-none py-3 text-white hover:bg-gray-700">Share to...</Button>
                        <Button variant='ghost' className="w-full justify-start rounded-none py-3 text-white hover:bg-gray-700">Copy link</Button>

                        {
                            user && user._id === post.author._id && (
                                <Button onClick={deletePostHandler} variant='ghost' className="w-full justify-start rounded-none py-3 text-white hover:bg-gray-700">Delete</Button>
                            )
                        }
                    </DialogContent>
                   
                </Dialog>
            </div>

            {/* Post Image */}
            <img
                src={post.image}
                className="w-full aspect-square object-cover rounded-lg"
                alt="Post content"
            />

            {/* Post Actions */}
            <div className="pt-4">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex gap-4">
                        <button onClick={likeOrDislikeHandler} className="text-2xl text-white hover:text-gray-300 cursor-pointer">
                            {
                                liked ? <FaHeart className="text-red-500 " /> : <FaRegHeart />
                            }
                        </button>
                        <button className="text-2xl text-white hover:text-gray-300 cursor-pointer" onClick={() => {
                            dispatch(setSelectedPost(post));
                            setOpen(true);
                        }}>
                            <FaRegCommentAlt />
                        </button>
                        <button className="text-2xl text-white hover:text-gray-300">
                            <IoIosSend />
                        </button>
                    </div>
                    <button onClick={bookmarkHandler} className="text-2xl text-white hover:text-gray-300">
                      <FaRegBookmark/>
                    </button>
                </div>

                {/* Likes */}
                <div className="text-sm font-semibold mb-1 text-white">{postLikes} likes</div>

                {/* Caption */}
                <div className="text-sm text-white">
                    {post.caption && (
                        <>
                            <span className="font-semibold mr-1">{post.author?.username}</span>
                            {post.caption}
                        </>
                    )}
                </div>

                {/* Comments */}
                {
                    post.comments.length > 0 && (
                        <button className="text-sm text-gray-400 hover:text-gray-300 mt-1 cursor-pointer" onClick={() => {
                    dispatch(setSelectedPost(post));
                    setOpen(true);
                }}>{
                        post.comments.length > 0 ? `View all ${post.comments.length} comments` : "No comments yet"
                    }</button>
                    )
                }
                <CommentDialog open={open} setOpen={setOpen}  commentHandler={commentHandler}/>
                
            </div>

            {/* Add comment */}
            <div className="py-3 pb-4 flex items-center">
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
        </div>
    )
}

export default Post;