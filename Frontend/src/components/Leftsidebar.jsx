import { Bell, Compass, Home, LogOut, Mail, Search, SquarePlus, X, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import CreatePost from './CreatePost';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { setNotifications } from '@/redux/notificationSlice';



function Leftsidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const navigate = useNavigate()
  const { user } = useSelector(store => store.auth)
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const {likeNotifications} = useSelector(store => store.notification);

  // const FilteredLikeNotifications = likeNotifications.filter((notification) => notification.userId !== user?._id);
  const FilteredLikeNotifications = [];

  const sidebarItems = [
    { icon: <Home className="w-6 h-6" />, text: "Home" },
    { icon: <Search className="w-6 h-6" />, text: "Search" },
    { icon: <Mail className="w-6 h-6" />, text: "Messages" },
    // { icon: <Compass className="w-6 h-6" />, text: "Explore" },
    { icon: <SquarePlus className="w-6 h-6" />, text: "Create Post" },
    { icon: <Bell className="w-6 h-6" />, text: "Notifications" },
    {
      icon: <Avatar className="w-6 h-6">
        <AvatarImage src={user?.profilePicture} className="w-full h-full object-cover" />
        <AvatarFallback className="bg-gray-600 text-white">
                    {user?.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
      </Avatar>,
      text: user?.username
    },
    { icon: <LogOut className="w-6 h-6" />, text: "Log out" },
  ];
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 640);
      if (window.innerWidth >= 640) setIsMobileOpen(false);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // useEffect(
  //   () => {
  //     setNotifications([]);
  //   }
  // )

  const logoutHandler = async (req, res) => {
    try {
      const res = await axios.get('http://localhost:8000/api/v2/user/logout', { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        // dispatch(setPosts([]));
        // dispatch(setSelectedPost(null));
        navigate('/login');
        // toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message); 
    }
  }

  const sidebarHandler = (textType) => {
    if (textType == 'Log out') {
      logoutHandler();
    }else if(textType == 'Create Post'){
      setOpen(true);
    }
    else if(textType == 'Home'){
      navigate('/');
    }
    else if(textType == 'Messages'){
      navigate(`/chat`);
    }
    else if(textType == user?.username){
      navigate(`/profile/${user?._id}`);
    }
  }
  return (
    <>
      {/* White Mobile Menu Button (only shows on small screens) */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed z-40 p-2 m-2 rounded-md md:hidden bg-gray-900 hover:bg-gray-700"
      >
        <Menu size={24} className="text-white" />
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed inset-y-0 left-0 z-30 flex-col h-screen p-4 w-64 border-r bg-white dark:bg-gray-900">
        <div className='flex justify-center mb-8'>
          <Link to={'/'}>
          <img
            src="../src/assets/logo.png"
            alt="Logo"
            className='h-8 w-auto mix-blend-lighten'
          />
          </Link>
        </div>

        <div className="space-y-2">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer relative"
              onClick={() => sidebarHandler(item.text)}
            >
              <div className="mr-3 text-gray-700 dark:text-gray-300">
                {item.icon}
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {item.text}
              </span>
              
              {
                item.text == 'Notifications' && FilteredLikeNotifications.length > 0 && (
                  <Popover className="relative">
                    <PopoverTrigger asChild>
                        <div className="absolute right-6 top-3 bg-gray-100 text-black font-weight-bold rounded-full p-1 px-2 text-xs">{FilteredLikeNotifications.length}</div>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="space-y-2">
                            {FilteredLikeNotifications.map((notification) => (
                                <div key={notification._id} className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                    <div className="mr-3 text-gray-700 dark:text-gray-300">
                                        <Avatar className="w-6 h-6">
                                            <AvatarImage src={notification.userDetails.profilepicture} className="w-full h-full object-cover" />
                                            <AvatarFallback className="bg-gray-600 text-white">
                                                {notification.userDetails.username.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                        {notification.message}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </PopoverContent>


                  </Popover>
              )
              }
            </div>
          ))}
        </div>
        <CreatePost open={open} setOpen={setOpen}/>
      </div>

      {/* Mobile Off-canvas Sidebar */}
      <div className={`md:hidden fixed inset-y-0 left-0 z-30 flex flex-col h-screen p-4 w-64 border-r bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Single Close Button (white) */}
        {/* <button 
          onClick={toggleMobileSidebar}
          className="absolute top-4 right-4 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X size={24} className="text-white dark:text-gray-300" />
        </button> */}

        <div className='flex justify-center mb-8 mt-2'>
          <img
            src="../src/assets/logo.png"
            alt="Logo"
            className='h-12 w-auto mix-blend-lighten'
          />
        </div>

        <div className="space-y-2">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => { setIsMobileOpen(false); sidebarHandler(item.text); }}
            >
              <div className="mr-3 text-gray-700 dark:text-gray-300">
                {item.icon}
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
}

export default Leftsidebar;