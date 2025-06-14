import sharp from "sharp";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) {
            return res.status(401).json({
                message: "Image required",
                success: false
            });
        };
        const optimizedImageBuffer = await sharp(image.buffer).resize({ width: 800, height: 800, fit: "inside" }).toFormat('jpeg', { quality: 80 }).toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        })
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: "New Post Added!",
            post,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}
export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ 
                path: 'author', 
                select: 'username profilepicture' 
            })
            .populate({
                path: 'comments',
                options: { sort: { createdAt: -1 } },  // This is where you specify sort for comments
                populate: {
                    path: 'author', 
                    select: 'username profilepicture'
                }
            });
        return res.status(200).json({
            posts,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}
export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilepicture' })
            .populate({
                path: 'comments', sort: { createdAt: -1 }, populate: {
                    path: 'author', select: 'username profilepicture'
                }
            })

        return res.status(200).json({
            posts,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}

export const likePost = async (req, res) => {
    try {
        const likerId = req.id
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Ye Tera Dimaag hai!!",
                success: false,
            });
        }
        await post.updateOne({ $addToSet: { likes: likerId } });
        await post.save();

        const owner = post.author._id.toString();
        
        const user = await User.findById(likerId).select('username profilepicture');

     
        if (owner !== likerId) {  
            const notification = {
                type: 'like',
                message: `${user.username} liked your post`,
                userId: likerId,
                userDetails: user,
                postId
            }
            
            const ownerSocketId = getReceiverSocketId(owner);
            if(ownerSocketId){
                io.to(ownerSocketId).emit('Notification', notification);
            }
        }  

        return res.status(200).json({
            message: "Liked!",
            post,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}

export const dislikePost = async (req, res) => {
    try {
        const likerId = req.id
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Ye Tera Dimaag hai!!",
                success: false,
            });
        }
        await post.updateOne({ $pull: { likes: likerId } });
        await post.save();

         const owner = post.author._id.toString();
        
        const user = await User.findById(likerId).select('username profilepicture');
        if (owner !== likerId) {  
            const notification = {
                type: 'dislike',
                message: `${user.username} disliked your post`,
                userId: likerId,
                userDetails: user,
                postId
            }

            const ownerSocketId = getReceiverSocketId(owner);
            if(ownerSocketId){
                io.to(ownerSocketId).emit('Notification', notification);
            }
        }  

        return res.status(200).json({
            message: "Disliked!",
            post,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commenterId = req.id;

        const { text } = req.body;

        const post = await Post.findById(postId);
        if (!text) {
            return res.status(400).json({
                message: "Comment is Required",
                success: false
            });
        }
        const comment = await Comment.create({
            text,
            author: commenterId,
            post: postId
        })
        await comment.populate({
            path: 'author',
            select: 'username profilepicture'
        });

        post.comments.push(comment._id);
        await post.save();
        return res.status(200).json({
            message: "Comment Added!",
            comment,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}

export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId }).populate('author', 'username', 'profilePicture');
        if (!comments) {
            return res.status(404).json({
                message: "Ye bhi Tera dimaag hai!!",
                success: false
            });
        }

        return res.status(200).json({
            comments,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            });
        }

        //checking if loggedin user is the owner of the post
        if (post.author.toString() != authorId) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        await Post.findByIdAndDelete(postId);

        //removing post from user's posts
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id?.toString() !== postId);
        await user.save();

        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            message: "Post Deleted",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}


export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            });
        }

        const user = await User.findById(authorId);

        if (user.bookmarks.includes(post._id)) {
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                type: 'unsaved',
                message: "Post removed from bookmark",
                success: true
            });
        } else {
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                type: 'saved',
                message: "Post is bookmarked",
                success: true
            });
        }
    } catch (error) {
        console.log(error);
    }
}

