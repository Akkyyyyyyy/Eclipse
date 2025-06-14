import { Label } from '@radix-ui/react-label'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { setAuthUser } from '@/redux/authSlice'
import { useDispatch, useSelector } from 'react-redux' // Import useSelector as well for user state access

function Login() {
    const { user } = useSelector(store => store.auth) // Access user state from useSelector hook to check if user is logged in already
    const [input, setInput] = useState({
        email: "",
        password: ""
    })
    // const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        if (user) return navigate('/') 
    }, [])

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
        // setError("")
    }

    const loginHandler = async (e) => {
        e.preventDefault()
        try {
            setLoading(true);
            const response = await axios.post(`https://eclipse0.onrender.com/api/v2/user/login`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })

            if (response.data.success) {
                dispatch(setAuthUser(response.data.user));
                // dispatch(setUserProfile(response.data.user));
                // console.log('Login successful', response.data)
                toast.success(response.data.message);
                navigate('/') // Redirect to dashboard on success
                setInput({
                    username: "",
                    email: "",
                    password: ""
                })
            }
        } catch (error) {
            console.error('Login error:', error)
            toast.error(error.response.data.message);
            // setError(error.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <form
                onSubmit={loginHandler}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6 border border-gray-200 dark:border-gray-700"
            >
                <div className='text-center space-y-3'>
                    <div className='flex justify-center'>
                        <img src="https://i.ibb.co/8gYfpmgP/logo.png" alt="logo" border="0" />
                    </div>
                    <p className='text-gray-500 dark:text-gray-400'>
                        Welcome back to your account
                    </p>
                </div>



                <div className='space-y-6'>
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
                            autoComplete="email"
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
                            autoComplete="current-password"
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
                            Log In
                        </Button>
                    )
                }


                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                        Sign up
                    </a>
                </p>
            </form>
        </div>
    )
}

export default Login