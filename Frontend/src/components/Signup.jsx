import { Label } from '@radix-ui/react-label'
import React, { useEffect, useState } from 'react' // Import useEffect for user state check
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux' // Import useSelector for user state access


function Signup() {
    const { user } = useSelector(store => store.auth) // Access user state from useSelector hook to check if user is logged in already
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
            if (user) return navigate('/') 
        }, [])

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        console.log(input);
        try {
            setLoading(true);
            const res = await axios.post(`${process.env.URL}api/v2/user/register`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                navigate('/login') ;
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: ""
                })
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <form
                onSubmit={signupHandler}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6 border border-gray-200 dark:border-gray-700"
            >
                <div className='text-center space-y-3'>
                    <div className='flex justify-center'>
                        <img
                            src="..\src\assets\logo.jpg"
                            alt="Logo"
                            className='h-16 w-auto mix-blend-lighten'  // Adjust size as needed
                        />
                    </div>
                    <p className='text-gray-500 dark:text-gray-400'>
                        Join our community today
                    </p>
                </div>

                <div className='space-y-6'>
                    {/* Username Field */}
                    <div className="relative h-14">
                        <Input
                            type="text"
                            name="username"
                            value={input.username}
                            onChange={changeEventHandler}
                            className="w-full h-full px-4 pt-4 pb-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg
                                        focus:border-blue-500 focus-visible:ring-transparent
                                        text-gray-900 dark:text-white
                                        peer autofill:bg-white dark:autofill:bg-gray-700"
                        />
                        <Label className={`absolute left-4 text-gray-500 dark:text-gray-400 
                                            transition-all duration-200 ease-out
                                            ${input.username ? 'top-0 text-sm text-blue-500 bg-white dark:bg-gray-800 px-1 -translate-y-1/2' :
                                'top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1 peer-focus:-translate-y-1/2'}
                                            pointer-events-none`}>
                            Username
                        </Label>
                    </div>

                    {/* Email Field */}
                    <div className="relative h-14">
                        <Input
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            className="w-full h-full px-4 pt-4 pb-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg
                                        focus:border-blue-500 focus-visible:ring-transparent
                                        text-gray-900 dark:text-white
                                        peer autofill:bg-white dark:autofill:bg-gray-700"
                        />
                        <Label className={`absolute left-4 text-gray-500 dark:text-gray-400 
                                            transition-all duration-200 ease-out
                                            ${input.email ? 'top-0 text-sm text-blue-500 bg-white dark:bg-gray-800 px-1 -translate-y-1/2' :
                                'top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1 peer-focus:-translate-y-1/2'}
                                            pointer-events-none`}>
                            Email
                        </Label>
                    </div>

                    {/* Password Field */}
                    <div className="relative h-14">
                        <Input
                            type="password"
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler}
                            className="w-full h-full px-4 pt-4 pb-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg
                                        focus:border-blue-500 focus-visible:ring-transparent
                                        text-gray-900 dark:text-white
                                        peer autofill:bg-white dark:autofill:bg-gray-700"
                        />
                        <Label className={`absolute left-4 text-gray-500 dark:text-gray-400 
                                            transition-all duration-200 ease-out
                                            ${input.password ? 'top-0 text-sm text-blue-500 bg-white dark:bg-gray-800 px-1 -translate-y-1/2' :
                                'top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1 peer-focus:-translate-y-1/2'}
                                            pointer-events-none`}>
                            Password
                        </Label>
                    </div>
                </div>
                {
                    loading ? (
                        <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white 
                        shadow-md hover:shadow-lg transition-all rounded-lg">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please Wait
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white 
                              shadow-md hover:shadow-lg transition-all rounded-lg"
                        >
                            Sign up
                        </Button>
                    )
                }

                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                        Log in
                    </a>
                </p>
            </form>
        </div>
    )
}

export default Signup
