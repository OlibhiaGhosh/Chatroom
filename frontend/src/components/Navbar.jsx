import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    let isMounted = true; // Set the mounted flag to true
    const controller = new AbortController(); // on unmounting all the pending requests will be aborted
    const checkLoginStatus = async () => {
      try {
        let currentUser = auth?.user;
        if (!currentUser) {
          // 🔁 Get user from backend if not present in context
          const userResponse = await axiosPrivate.post("/api/auth/getUserdata", {}, {
            signal: controller.signal, // Pass the abort signal to the request
          });
          currentUser = userResponse.data.user;
          setAuth(prev => ({ ...prev, user: currentUser }));
        }
        setIsLoggedIn(!!currentUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    checkLoginStatus();
    return () => {
      isMounted = false;
      controller.abort(); // Abort the request on unmount
    };
  }, [auth, setAuth]);

  const handleLogout = () => {
    const controller = new AbortController();
    try {
      const response = axiosPrivate.post(
        "/api/auth/logout",
        {
            signal: controller.signal, // Pass the abort signal to the request
          }
      );
      console.log("Logout successful:", response.data);
      setAuth({});
      setIsLoggedIn(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    return () => {
      controller.abort(); // Abort the logout request on unmount
    };
  };

  return (
      <nav className="border-b border-green-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                ChatConnect
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => navigate('/')} className="text-gray-300 hover:text-green-400 transition-colors">
                Home
              </button>
              {isLoggedIn && (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/create-chatroom')}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    Create Room
                  </button>
                </>
              )}
              <button className="text-gray-300 hover:text-green-400 transition-colors">About</button>
              <button className="text-gray-300 hover:text-green-400 transition-colors">Contact</button>
            </div>

            <div className="flex items-center gap-4">
              {!isLoggedIn ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 border border-blue-600 text-blue-400 rounded-md hover:bg-blue-900/20 hover:text-blue-300 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-md hover:from-green-600 hover:to-green-800 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-blue-400">Welcome!</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-sm border border-red-600 text-red-500 rounded-md hover:bg-red-900/20 hover:text-red-400 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
};

export default Navbar;