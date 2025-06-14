import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setAuthUser, setUserProfile } from '@/redux/authSlice'; // or wherever your Redux actions are
import { readFileAsDataURL } from '@/lib/utils';

const EditProfile = () => {
    const { user } = useSelector(store => store.auth);
    const [file, setFile] = useState("");
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        bio: user?.bio || '',
        gender: user?.gender || '',
        profilePicture: user?.profilePicture || ''
    });
    console.log(user);


    const [previewImage, setPreviewImage] = useState(user?.profilePicture || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };


    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setPreviewImage(dataUrl);
            setFormData(prevData => ({
                ...prevData,
                profilePicture: dataUrl  // Replace with your new value
            }));

        };


    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log(formData);
            const form = new FormData();
            form.append('bio', formData.bio);
            form.append('gender', formData.gender);
            if (file) {
                form.append('profilePicture', file);
            }else {
                // If no new file is selected, send the existing profile picture URL
                form.append('profilePicture', formData.profilePicture);
            }
            await axios.post('http://localhost:8000/api/v2/user/profile/edit', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            toast.success('Profile updated successfully');
            // dispatch(setAuthUser(user));
            const updatedUserData = {
                ...user,
                bio: formData.bio,
                gender: formData.gender,
                profilePicture: formData.profilePicture,
            };
            dispatch(setAuthUser(updatedUserData));
            // dispatch(setUserProfile(updatedUserData));
            navigate(`/profile/${user?._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto sm:pl-20 md:pl-64 py-10 bg-white dark:bg-gray-900 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold dark:text-white mb-6">Edit Profile</h1>

                <form onSubmit={handleSubmit}>
                    {/* Profile Picture Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <Avatar
                                    className="h-24 w-24 md:h-32 md:w-32 border-4 border-gray-200 dark:border-gray-700 cursor-pointer"
                                    onClick={handleImageClick}
                                >
                                    <AvatarImage
                                        src={previewImage}
                                        className="w-full h-full object-cover"
                                    />
                                    <AvatarFallback className="bg-gray-600 text-white text-xl font-medium">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </Avatar>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold dark:text-white tracking-tight mb-3">
                                    {user?.username}
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    Click on the avatar to change your profile picture
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    JPG, GIF or PNG. Max size of 2MB (will be compressed if larger)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bio Field */}
                    <div className="mb-6">
                        <Label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Title
                        </Label>
                        <Input
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full"
                            placeholder="Astroid Destroyer, Space Explorer, etc."
                        />
                    </div>

                    {/* Gender Field */}
                    <div className="mb-8">
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Gender
                        </Label>
                        <Select
                            value={formData.gender}
                            onValueChange={(value) => setFormData({ ...formData, gender: value })}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="px-6"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="px-6"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;