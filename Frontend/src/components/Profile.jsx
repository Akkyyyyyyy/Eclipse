import useGetUserProfile from '@/hooks/useGetUserProfile'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FaCommentAlt, FaHeart } from 'react-icons/fa'
import { Button } from './ui/button'
import { MessageCircle, PenLine, UserMinus, UserPlus } from 'lucide-react'
import axios from 'axios'
import { setAuthUser, setUserProfile } from '@/redux/authSlice'

function Profile() {
  const params = useParams()
  const userId = params.id;
  useGetUserProfile(userId);
  const dispatch = useDispatch();
  const { userProfile, user } = useSelector(store => store.auth)
  const isLoggedInUser = user?._id === userProfile?._id;
  // const [isFollowing, setIsFollowing] = useState(user?.following?.includes(userProfile?._id));
  const [activeTab, setActiveTab] = useState('posts');
  const userPosts = userProfile?.posts;
  const bookmarkedPosts = userProfile?.bookmarks;
  const [isLoading, setIsLoading] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false); // Initialize as false
  const [isInitialized, setIsInitialized] = useState(false); // Track if initialized

  // Update isFollowing when user or userProfile changes
  useEffect(() => {
    if (user && userProfile) {
      setIsFollowing(user?.following?.includes(userProfile?._id));
      setIsInitialized(true);
    }
  }, [user, userProfile]);

  const handleFollow = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.URL}/api/v2/user/followorUnfollow/${userProfile?._id}`, 
        {}, 
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        const newFollowingState = !isFollowing;
        setIsFollowing(newFollowingState);
        
        // Update logged-in user's following list
        const updatedUser = { ...user };
        if (newFollowingState) {
          updatedUser.following = [...(updatedUser.following || []), userProfile?._id];
        } else {
          updatedUser.following = updatedUser.following.filter(id => id !== userProfile?._id);
        }
        dispatch(setAuthUser(updatedUser));

        // Update profile user's followers list
        const updatedUserProfile = { ...userProfile };
        if (newFollowingState) {
          updatedUserProfile.followers = [...(updatedUserProfile.followers || []), user?._id];
        } else {
          updatedUserProfile.followers = updatedUserProfile.followers.filter(id => id !== user?._id);
        }
        dispatch(setUserProfile(updatedUserProfile));
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    } finally {
      setIsLoading(false);
    }
  };
//nothin
  return (
    <div className="container mx-auto sm:pl-20 md:pl-64 py-10 bg-white dark:bg-gray-900 min-h-screen">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 px-12">
        <div className="relative group">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-gray-200 dark:border-gray-700 transition-all duration-300 group-hover:border-blue-500">
            <AvatarImage
              src={userProfile?.profilepicture}
              className="w-full h-full object-cover"
            />
            <AvatarFallback className="bg-gray-600 text-white text-3xl font-medium">
              {userProfile?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold dark:text-white tracking-tight">{userProfile?.username}</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg">
              {userProfile?.bio || "No bio yet"}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {isLoggedInUser ? (
                <Link to="/profile/edit">
                  <Button variant="outline" className="gap-2">
                    <PenLine className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              ) : (
                <>
                  <Button 
                    onClick={handleFollow}
                    disabled={isLoading}
                    className="gap-2"
                    variant={isFollowing ? "outline" : "default"}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="h-4 w-4" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Follow
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex w-full py-2">
            <div className="flex flex-1 justify-between max-w-xs mx-auto md:mx-0 md:max-w-1/2 md:justify-start md:gap-12">
              <div className="flex flex-col items-center md:items-start flex-1 min-w-0">
                <span className="font-bold text-lg dark:text-white">{userProfile?.posts?.length || 0}</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">Posts</p>
              </div>
              <div className="flex flex-col items-center md:items-start flex-1 min-w-0">
                <span className="font-bold text-lg dark:text-white">{userProfile?.followers?.length || 0}</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
              </div>
              <div className="flex flex-col items-center md:items-start flex-1 min-w-0">
                <span className="font-bold text-lg dark:text-white">{userProfile?.following?.length || 0}</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-6 mx-6"></div>

      {/* Profile Content */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger
            value="posts"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 py-2 rounded-md transition-all"
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Posts
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 py-2 rounded-md transition-all"
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Saved
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="tagged"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 py-2 rounded-md transition-all"
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Tagged
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-8 px-6">
          {userPosts?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
              {userPosts.map((post) => (
                <div key={post?._id} className=" bg-gray-100 dark:bg-gray-700 overflow-hidden relative group">
                  <img
                    src={post?.image}
                    className="aspect-square w-full h-full object-cover"
                    alt="Post"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Caption - appears at top on hover */}


                  {/* Stats panel that slides up */}
                  <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-transparent p-4">
                    {post?.caption && (
                      <p className="text-white text-sm font-medium flex h-6">{post?.caption}</p>
                    )}
                    <hr className="w-full h-px bg-gray-400/50 dark:bg-gray-600/50 my-2 transition-all duration-300 opacity-0 group-hover:opacity-100" />

                    <div className="flex  space-x-8 text-white transition-all duration-300 delay-150 opacity-0 group-hover:opacity-100">
                      <div className="flex items-center gap-2">
                        <FaHeart className="text-lg" />
                        <span className="font-medium">{post?.likes?.length}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaCommentAlt className="text-lg" />
                        <span className="font-medium">{post?.comments?.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Subtle shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-2 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">No posts yet</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-500">When you share photos, they'll appear here</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-8 px-6">
          {bookmarkedPosts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
              {bookmarkedPosts.map((post) => (
                 <div key={post?._id} className=" bg-gray-100 dark:bg-gray-700 overflow-hidden relative group">
                  <img
                    src={post?.image}
                    className="aspect-square w-full h-full object-cover"
                    alt="Post"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Caption - appears at top on hover */}


                  {/* Stats panel that slides up */}
                  <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-transparent p-4">
                    {post?.caption && (
                      <p className="text-white text-sm font-medium flex h-6">{post?.caption}</p>
                    )}
                    <hr className="w-full h-px bg-gray-400/50 dark:bg-gray-600/50 my-2 transition-all duration-300 opacity-0 group-hover:opacity-100" />

                    <div className="flex  space-x-8 text-white transition-all duration-300 delay-150 opacity-0 group-hover:opacity-100">
                      <div className="flex items-center gap-2">
                        <FaHeart className="text-lg" />
                        <span className="font-medium">{post?.likes?.length}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaCommentAlt className="text-lg" />
                        <span className="font-medium">{post?.comments?.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Subtle shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-2 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">No saved posts</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-500">Save photos and videos to view them later</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tagged" className="mt-8 px-6">
          <div className="py-2 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">No tagged photos</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-500">When people tag you in photos, they'll appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Profile