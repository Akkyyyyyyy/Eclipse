import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import sharp from "sharp";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email Already Exist!",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(200).json({
      message: "Account Created!",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "User doesn't exist!",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "incorrect Password!",
        success: false
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // const PopulatedPosts = await Promise.all(
    //   user.posts.map(async(postId)=>{
    //     const post = await Post.findById(postId);
    //     if(post.author.equals(user._id)){
    //       return post;
    //     }
    //     return null;
    //   })
    // )

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilepicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
      bookmarks: user.bookmarks,
      gender: user.gender
    };
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome Back ${user.username}`,
        success: true,
        user
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: 'Logged out Successfully.',
      success: true
    });
  } catch (error) {
    console.log(error);
  }
}

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId)
      .populate({
        path: 'posts',
        options: { sort: { createdAt: -1 } },
        populate: [
          { 
            path: 'author', 
            select: 'username profilepicture' 
          },
          {
            path: 'comments',
            options: { sort: { createdAt: -1 } },
            populate: {
              path: 'author', 
              select: 'username profilepicture'
            }
          }
        ]
      })
      .populate('bookmarks');

    return res.status(200).json({
      user,
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const image = req.file;
    let cloudResponse;

    if (image) {
      const optimizedImageBuffer = await sharp(image.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat('jpeg', { quality: 80 })
        .toBuffer();

      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (cloudResponse?.secure_url) user.profilepicture = cloudResponse.secure_url;

    await user.save();
    return res.status(200).json({
      message: "Profile updated",
      success: true,
      user
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};


export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have any users",
        success: false
      });
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers
    });
  } catch (error) {
    console.log(error);
  }
}


export const followOrUnfollow = async (req, res) => {
  try {
    const follow = req.id;
    const other = req.params.id;
    if (follow === other) {
      return res.status(400).json({
        message: "Trying to follow your self",
        success: false
      });
    }

    const user = await User.findById(follow);
    const targetUser = await User.findById(other);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "user not found",
        success: false
      });
    }

    const isFollowing = user.following.includes(other);
    if (isFollowing) {
      await Promise.all([
        User.updateOne({ _id: follow }, { $pull: { following: other } }),
        User.updateOne({ _id: other }, { $pull: { followers: follow } })
      ]);
      return res.status(200).json({
        message: "Unfollowed Successfully",
        success: true
      });
    }
    else {
      await Promise.all([
        User.updateOne({ _id: follow }, { $push: { following: other } }),
        User.updateOne({ _id: other }, { $push: { followers: follow } })
      ]);
      return res.status(200).json({
        message: "followed Successfully",
        success: true
      });
    }
  } catch (error) {
    console.log(error);
  }
}
