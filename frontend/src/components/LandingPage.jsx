import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleCreateChatroom = () => {
    if (isLoggedIn) {
      navigate('/create-chatroom');
    } else {
      navigate('/login');
    }
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <nav className="border-b border-green-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                  ChatConnect
                </h1>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <button className="text-gray-300 hover:text-green-400 transition-colors">Home</button>
                <button className="text-gray-300 hover:text-green-400 transition-colors">About</button>
                <button className="text-gray-300 hover:text-green-400 transition-colors">Contact</button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-blue-600 text-blue-400 rounded-md hover:bg-blue-900/20 hover:text-blue-300 transition-colors">
                    Login
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-md hover:from-green-600 hover:to-green-800 transition-colors">
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-16">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              ChatConnect
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              Create private chat rooms instantly and connect with friends, colleagues, or teammates in real-time.
            </p>
          </div>
          <div className="mb-16 flex flex-col items-center justify-center space-y-6">
            <button className="group h-14 w-64 bg-gradient-to-r from-green-500 to-green-700 text-lg text-white rounded-md hover:from-green-600 hover:to-green-800 transition-colors flex items-center justify-center">
              Create Your Chat Room
              <svg
                className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
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

      <div className="container mx-auto px-4 py-16">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            ChatConnect
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-300">
            Create private chat rooms instantly and connect with friends, colleagues, or teammates in real-time.
          </p>
        </div>

        <div className="mb-16 flex flex-col items-center justify-center space-y-6">
          <button
            onClick={handleCreateChatroom}
            className="group h-14 w-64 bg-gradient-to-r from-green-500 to-green-700 text-lg text-white rounded-md hover:from-green-600 hover:to-green-800 transition-colors flex items-center justify-center"
          >
            Create Your Chat Room
            <svg
              className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {isLoggedIn && (
            <button
              onClick={handleViewDashboard}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View Your Chatrooms
            </button>
          )}
        </div>

        {isLoggedIn && (
          <div>
            <h2 className="mb-6 text-center text-2xl font-bold text-blue-400">Your Recent Chatrooms</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="border border-green-800 bg-gray-900 rounded-lg p-6 transition-all hover:shadow-md hover:shadow-green-900/20">
                <div className="mb-4">
                  <h3 className="text-xl text-green-500 font-semibold">Team Alpha</h3>
                  <p className="text-blue-400 text-sm">Created 2 days ago</p>
                </div>
                <div>
                  <p className="text-gray-300 mb-4">3 members active</p>
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                      Join
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-green-800 bg-gray-900 rounded-lg p-6 transition-all hover:shadow-md hover:shadow-green-900/20">
                <div className="mb-4">
                  <h3 className="text-xl text-green-500 font-semibold">Project Discussion</h3>
                  <p className="text-blue-400 text-sm">Created 5 days ago</p>
                </div>
                <div>
                  <p className="text-gray-300 mb-4">5 members active</p>
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                      Join
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center border-dashed border-green-800 bg-gray-900 rounded-lg p-6 transition-all hover:border-green-600">
                <button
                  onClick={handleCreateChatroom}
                  className="h-full w-full flex flex-col items-center gap-2 text-green-500 hover:bg-green-900/20 hover:text-green-400 transition-colors rounded-md p-4"
                >
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create New Chatroom</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-24 text-center">
          <h2 className="mb-6 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            Why Choose ChatConnect?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-gray-800 p-6">
              <h3 className="mb-2 text-xl font-semibold text-green-500">Instant Setup</h3>
              <p className="text-gray-300">Create a chatroom in seconds and start inviting people right away.</p>
            </div>
            <div className="rounded-lg bg-gray-800 p-6">
              <h3 className="mb-2 text-xl font-semibold text-green-500">Private & Secure</h3>
              <p className="text-gray-300">Your conversations stay private with secure, invite-only access.</p>
            </div>
            <div className="rounded-lg bg-gray-800 p-6">
              <h3 className="mb-2 text-xl font-semibold text-green-500">Real-time Chat</h3>
              <p className="text-gray-300">Experience seamless real-time messaging with instant delivery.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;