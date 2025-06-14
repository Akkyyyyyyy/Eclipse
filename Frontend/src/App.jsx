import Home from './components/Home';
import Login from './components/Login';
import MainPage from './components/MainPage';
import Profile from './components/Profile';
import Signup from './components/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import EditProfile from './components/EditProfile';
import ChatPage from './components/ChatPage';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { setSocket } from './redux/socketSlice';
// import { useSocket } from './hooks/useSocket';
import { setOnlineUsers } from './redux/chatSlice'; // Make sure you have this action
import { setMessages } from './redux/chatSlice';
// import { setNotifications } from './redux/notificationSlice';
import ProtectedRoutes from './components/ProtectedRoutes';
import { setNotifications, clearNotifications } from './redux/notificationSlice';

function App() {

  const BrowserRouter = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoutes><MainPage /></ProtectedRoutes>,
      children: [
        {
          path: '/',
          element: <ProtectedRoutes><Home /></ProtectedRoutes>
        },
        {
          path: '/profile/:id',
          element: <ProtectedRoutes><Profile /></ProtectedRoutes>
        },
        {
          path: '/profile/edit',
          element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
        },
        {
          path: '/chat',
          element:<ProtectedRoutes> <ChatPage /></ProtectedRoutes>
        }
      ]
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/signup',
      element: <Signup />
    }
  ])
  const { user } = useSelector(store => store.auth)
  const { messages } = useSelector(store => store.chat);
  const { socket } = useSelector(store => store.socket);
  // const socket = useSocket();
  const dispatch = useDispatch();
  let socketio;
  useEffect(() => {
    if (user) {
      socketio = io('http://localhost:8000', {
        query: {
          userId: user._id
        },
        transports: ['websocket']
      });
      // dispatch(setSocket(socketio));
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      socketio.on('newMessage', (message) => {
        console.log('New message received!', message);
        dispatch(setMessages([...messages, message]));
        // Handle the message in your state here
      });
      socketio.on('Notification', (notification) => {
        // dispatch(setNotifications(notification));
        dispatch(clearNotifications());
      });
      return () => {
        // socketio.close();
        // dispatch(setSocket(null));
      }
    } else if (socket) {
      socket.close();
    }
  }, [user, dispatch, messages]);
  return (
    <>
      <RouterProvider router={BrowserRouter} />
    </>
  )
}

export default App
