import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import {  ImageIcon, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';
import { useNavigate } from 'react-router-dom';

const CreatePost=({open,setOpen})=> {
  const imageRef = useRef(null);
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store=>store.auth);
  const {posts} = useSelector(store=>store.post);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileChangeHandler = async(e) =>{
    const file = e.target.files?.[0];
    if(file){
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  } 
  const createPostHandler = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption",caption);
    if(imagePreview){
      formData.append("image",file);
    }
    console.log(file, caption);
    
    try {
      setLoading(true);
      const res = await axios.post(`${process.env.URL}api/v2/post/addPost`, formData, {
        headers:{ 
          'Content-Type': 'multipart/form-data',
        },
        withCredentials:true
      });
      console.log(res.data);
      
      if(res.data.success){
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setCaption("");
        setImagePreview("");
        setFile("");
        setOpen(false);  
        navigate('/');
      }
    } catch (error) {
      toast.error(response.data.message);
    } finally{
      setLoading(false);
    }
  }
  return (
 <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent 
    onInteractOutside={() => setOpen(false)}
    className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-900"
  >
    <DialogHeader className="text-center sticky top-0 bg-white dark:bg-gray-900 z-10 py-2">
      <DialogTitle className="text-lg font-bold text-gray-800 dark:text-white">
        Create New Post
      </DialogTitle>
    </DialogHeader>
    
    <div className="space-y-4 py-2">
      {/* User Info */}
      <div className="flex gap-3 items-center p-2 rounded-lg ">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.profilePicture} alt="Profile"  className="w-full h-full object-cover"/>
          <AvatarFallback className="bg-gray-600 text-white">
                      {user?.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-semibold text-sm dark:text-white">
             {user?.username}
            </h1>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {/* {user?.bio || "Share your thoughts"} */}
            {user?.bio}
          </span>
        </div>
      </div>

      {/* Caption */}
      <Textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="min-h-[120px] max-h-[200px] focus-visible:ring-0 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        placeholder="What's on your mind?"
      />

      {/* Image Preview - Now with constrained dimensions */}
      {imagePreview && (
        <div className="relative w-full max-h-[400px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex justify-center bg-gray-100 dark:bg-gray-800">
          <img 
            src={imagePreview} 
            alt="preview" 
            className="max-h-[400px] object-contain" 
          />
          {loading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
      )}

      {/* File Input (hidden) */}
      <input 
        ref={imageRef} 
        type="file" 
        className="hidden" 
        accept="image/*"
        onChange={fileChangeHandler}
      />

      {/* Action Buttons - Sticky bottom */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4 pb-2">
        <div className="flex flex-col gap-2">
          {!imagePreview ? (
            <Button
              onClick={() => imageRef.current.click()}
              variant="outline"
              className="w-full cursor-pointer border-dashed border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Select from Computer
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setImagePreview(null);
                  setFile(null);
                }}
                variant="outline"
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
              <Button
                onClick={createPostHandler}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#0095f6] to-[#1877f2] hover:from-[#1877f2] hover:to-[#0095f6]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  </DialogContent>
</Dialog>
  )
}

export default CreatePost