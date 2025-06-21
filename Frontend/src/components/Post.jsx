import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { Badge } from "./ui/badge";
import { setAuthUser } from "@/redux/authSlice";

function Post({ post }) {
    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    const { user, userProfile } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
    const [postLikes, setPostLikes] = useState(post?.likes?.length || 0);
    const [comment, setComment] = useState(post?.comments || []);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const [isBookmarked, setIsBookmarked] = useState(user?.bookmarks?.map(bk => bk._id).includes(post._id) || false);


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const changeEventHandler = (e) => {
        const input = e.target.value;
        setText(input.trim() ? input : "");
    }

    const deletePostHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.delete(`https://eclipse0.onrender.com/api/v2/post/delete/${post?._id}`, {
                withCredentials: true
            });

            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem._id !== post?._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete post");
        }
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`https://eclipse0.onrender.com/api/v2/post/${post._id}/${action}`, {
                withCredentials: true
            });

            if (res.data.success) {
                setPostLikes(prev => liked ? prev - 1 : prev + 1);
                setLiked(!liked);
                const updatedPostData = posts.map(
                    (p) => p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter((id) => id !== user._id) : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update like");
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`https://eclipse0.onrender.com/api/v2/post/${post._id}/comment`,
                { text },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

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
            toast.error(error.response?.data?.message || "Failed to add comment");
        }
    }

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`https://eclipse0.onrender.com/api/v2/post/${post._id}/bookmark`, {
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setIsBookmarked(!isBookmarked);

                let updatedBookmarks;


                if (isBookmarked == true) {
                    updatedBookmarks = user.bookmarks.includes(post._id)
                        ? user.bookmarks : [...user.bookmarks, post._id];
                    console.log(updatedBookmarks);

                }
                else {
                    updatedBookmarks = user.bookmarks.filter(id => id !== post._id);
                }
                dispatch(setAuthUser({ ...user, bookmarks: updatedBookmarks }));
            }
        } catch (error) {
            console.log(error);

        }
    }

    const formatShortDate = (date) => {
        if (!date || isNaN(new Date(date))) return '';
        const distance = formatDistanceToNow(new Date(date), {
            addSuffix: false,
            includeSeconds: true
        });

        if (distance.includes('less than') || distance.includes('seconds') || distance.includes('half')) {
            return 'just now';
        }

        const cleanDistance = distance.replace(/^about /, '');
        const parts = cleanDistance.split(' ');
        const value = parts[0];
        const unit = parts[1][0];

        return `${value}${unit}`;
    }

    if (isLoading) {
        return (
            <div className="border-b border-gray-700 bg-white dark:bg-gray-900 max-w-lg mx-auto p-4">
                <div className="flex items-center justify-between mb-4 text">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                        <Skeleton className="h-4 w-60 bg-gray-200 dark:bg-gray-800" />
                    </div>
                </div>

                <Skeleton className="w-(80%) md:w-lg aspect-square rounded-lg mb-4 bg-gray-200 dark:bg-gray-800" />

                <div className="flex justify-between mb-3">
                    <div className="flex gap-4">
                        <Skeleton className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-800" />
                        <Skeleton className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-800" />
                        <Skeleton className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-800" />
                    </div>
                    <Skeleton className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>

                <Skeleton className="h-4 w-16 mb-2 bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-full mb-1 bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800" />
            </div>
        );
    }

    return (
        <div className="border-b border-gray-700 bg-white dark:bg-gray-900 max-w-lg mx-auto">
            <div className="flex items-center justify-between py-4 px-4">
                <div className="flex items-center gap-2">
                    <Avatar className="w-9 h-9 border border-gray-600">
                        <AvatarImage src={post?.author?.profilepicture} className="w-full h-full object-cover" />
                        <AvatarFallback className="bg-gray-600 text-white">
                            {post?.author?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <Link to={`/profile/${post?.author?._id}`} className="font-semibold text-sm text-white">
                        {post?.author?.username}
                    </Link>
                    {user && user._id === post?.author?._id && (
                        <Badge variant="outline">Owner</Badge>
                    )}
                    <div className="text-xs text-gray-400 mt-1">•</div>
                    {post?.createdAt && !isNaN(new Date(post?.createdAt)) && (
                        <div className="text-xs text-gray-400 mt-1">
                            {formatShortDate(post?.createdAt)}
                        </div>
                    )}
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className="cursor-pointer text-gray-300 hover:text-white" size={20} />
                    </DialogTrigger>
                    <DialogContent className="p-0 rounded-lg max-w-xs bg-gray-800 border-gray-700 text-center">
                        {user && user._id !== post?.author?._id && (
                            <Button variant='ghost' className="w-full justify-start rounded-none py-3 text-[#ed4956] hover:bg-gray-700">
                                Unfollow
                            </Button>
                        )}
                        <Button variant='ghost' className="w-full justify-start rounded-none py-3 text-white hover:bg-gray-700">
                            Go to post
                        </Button>
                        {user && user._id === post?.author?._id && (
                            <Button onClick={deletePostHandler} variant='ghost' className="w-full justify-start rounded-none py-3 text-white hover:bg-gray-700">
                                Delete
                            </Button>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            <img
                src={post?.image}
                className="w-full aspect-square object-cover rounded-lg"
                alt="Post content"
            />

            <div className="pt-4 px-4">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex gap-4">
                        <button onClick={likeOrDislikeHandler} className="text-2xl text-white hover:text-gray-300 cursor-pointer">
                            {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                        </button>
                        <button
                            className="text-2xl text-white hover:text-gray-300 cursor-pointer"
                            onClick={() => {
                                dispatch(setSelectedPost(post));
                                setOpen(true);
                            }}
                        >
                            <FaRegCommentAlt />
                        </button>
                        <button className="text-2xl text-white hover:text-gray-300">
                            <IoIosSend />
                        </button>
                    </div>
                    <button onClick={bookmarkHandler} className="text-2xl text-white hover:text-gray-300">
                        {
                            // isBookmarked ? <FaBookmark/> : <FaRegBookmark/>
                            <FaRegBookmark />
                        }
                    </button>
                </div>

                <div className="text-sm font-semibold mb-1 text-white">
                    {postLikes} likes
                </div>

                <div className="text-sm text-white">
                    {post?.caption && (
                        <>
                            <span className="font-semibold mr-1">{post?.author?.username}</span>
                            {post?.caption}
                        </>
                    )}
                </div>

                {post?.comments?.length > 0 && (
                    <button
                        className="text-sm text-gray-400 hover:text-gray-300 mt-1 cursor-pointer"
                        onClick={() => {
                            dispatch(setSelectedPost(post));
                            setOpen(true);
                        }}
                    >
                        View all {post?.comments?.length} comments
                    </button>
                )}
                <CommentDialog open={open} setOpen={setOpen} commentHandler={commentHandler} />
            </div>

            {/* Add comment */}
            <div className="py-3 pb-4 px-4 flex items-center">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={text}
                    onChange={changeEventHandler}
                    className="flex-1 text-sm outline-none bg-transparent text-white placeholder-gray-400"
                />
                {text && (
                    <button
                        onClick={commentHandler}
                        className="text-blue-400 font-semibold text-sm hover:text-blue-300"
                    >
                        Post
                    </button>
                )}
            </div>
        </div>
    )
}

export default Post;