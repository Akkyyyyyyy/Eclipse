import { Bell, Home, LogOut, Mail, Search, SquarePlus, X, Menu, MessageSquareHeart, MessageSquareText, MessageSquareMore } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import CreatePost from './CreatePost.jsx';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';

function Leftsidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { likeNotifications } = useSelector(store => store.notification);
  const FilteredLikeNotifications = [];

  // Mobile tabs configuration
  const mobileTabs = [
    { icon: <Home className="w-6 h-6" />, text: "Home" },
    { icon: <Search className="w-6 h-6" />, text: "Search" },
    { icon: <SquarePlus className="w-6 h-6" />, text: "Create Post" },
    { icon: <Bell className="w-6 h-6" />, text: "Notifications" },
    {
      icon: <Avatar className="w-6 h-6">
        <AvatarImage src={user?.profilePicture} className="w-full h-full object-cover" />
        <AvatarFallback className="bg-gray-600 text-white">
          {user?.username?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>,
      text: user?.username
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      if (window.innerWidth >= 768) setIsMobileOpen(false);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`https://eclipse0.onrender.com/api/v2/user/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed'); 
    }
  };

  const sidebarHandler = (textType) => {
    switch(textType) {
      case 'Log out': logoutHandler(); break;
      case 'Create Post': setOpen(true); break;
      case 'Home': navigate('/'); break;
      case 'Messages': navigate('/chat'); break;
      case user?.username: navigate(`/profile/${user?._id}`); break;
      default: break;
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed inset-y-0 left-0 z-30 flex-col h-screen p-4 w-64 border-r bg-gray-900">
        <div className='flex justify-center mb-8'>
          <Link to={'/'}>
            <img src="https://i.ibb.co/8gYfpmgP/logo.png" alt="logo" className='w-32'/>
          </Link>
        </div>

        <div className="space-y-2">
          {[
            ...mobileTabs,
            { icon: <Mail className="w-6 h-6" />, text: "Messages" },
            { icon: <LogOut className="w-6 h-6" />, text: "Log out" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 cursor-pointer relative"
              onClick={() => sidebarHandler(item.text)}
            >
              <div className="mr-3">
                {item.icon}
              </div>
              <span className="font-medium">
                {item.text}
              </span>
              {item.text === 'Notifications' && FilteredLikeNotifications.length > 0 && (
                <div className="absolute right-6 top-3 bg-primary text-primary-foreground rounded-full p-1 px-2 text-xs">
                  {FilteredLikeNotifications.length}
                </div>
              )}
            </div>
          ))}
        </div>
        <CreatePost open={open} setOpen={setOpen}/>
      </div>

      {/* Mobile Top Navbar (Logo only) */}
      <nav className='fixed md:hidden flex items-center justify-between h-16 top-0 left-0 right-0 z-50 bg-gray-900 border-b p-5'>
        <Link to={'/'}>
          <img 
            src="https://i.ibb.co/8gYfpmgP/logo.png" 
            alt="logo" 
            className='w-32 h-auto'
          />
        </Link>
        <button
            
            className="p-3 cursor-pointer"
            onClick={() => sidebarHandler('Messages')}
          >
           <MessageSquareMore className="w-6 h-6"  /> 
           
          </button>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className='fixed md:hidden flex items-center justify-around h-16 bottom-0 left-0 right-0 z-50 bg-gray-900 border-t'>
        {mobileTabs.map((item, index) => (
          <button
            key={index}
            className="p-3 cursor-pointer"
            onClick={() => sidebarHandler(item.text)}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {/* Mobile Sidebar (hidden by default) */}
      <div className={`md:hidden fixed inset-y-0 left-0 z-[60] flex flex-col h-screen p-4 w-64 bg-background transform transition-transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button 
          onClick={toggleMobileSidebar}
          className="absolute top-5 left-4 p-1 rounded-md"
        >
          <X size={24} />
        </button>

        <div className='flex justify-center mb-8 mt-2'>
          <img src="https://i.ibb.co/8gYfpmgP/logo.png" alt="logo" className='w-32'/>
        </div>

        <div className="space-y-2">
          {[
            ...mobileTabs,
            { icon: <Mail className="w-6 h-6" />, text: "Messages" },
            { icon: <LogOut className="w-6 h-6" />, text: "Log out" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center p-3 rounded-lg hover:bg-accent cursor-pointer"
              onClick={() => { setIsMobileOpen(false); sidebarHandler(item.text); }}
            >
              <div className="mr-3">
                {item.icon}
              </div>
              <span className="font-medium">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[50] bg-black/50 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
}

export default Leftsidebar;